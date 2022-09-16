import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {StateType} from '../../redux/store';
import NfcManager, {Ndef, NfcEvents, NfcTech, TagEvent} from 'react-native-nfc-manager';
import {DefaultApi} from '../../api/apis/DefaultApi';
import {Configuration} from '../../api/runtime';
import {DEFAULT_URL} from '../../../config';
import {Buffer} from 'buffer';
import { TagFactory } from '../../tags/TagFactory';
import { NFCOperationManager } from '../../tags/NFCOperationManager';

async function writeNdef(token: string, barcode: string, setError: (error: string) => void, setSuccess: () => void, setWriting: () => void, location?: {longitude: number; latitude: number}) {
  
  try {
    
    const api = new DefaultApi(
      new Configuration({
        apiKey: token,
      }),
    );

    await NFCOperationManager.requestAllSupportedTechs();

    setWriting();

    let tag = await NfcManager.getTag();
    let nfcTag = TagFactory.createTag(tag)

    if (nfcTag == null) {
        console.log('Tag is not detected as of any of known types');
        setError('Not a valid tag')
        return
    } 

    var res: {newCipher: string; password: string};
    try { 
      res = (await api.tagPost({tagPOSTModel: {barcode, uid: nfcTag.uid}})) as any;
      console.log('NFC: Initializing');
      let initStatus = await nfcTag.initialize();
      if (!initStatus) {
        throw 'Problem initializing tag';
      }
    } catch (error) {
      if (error.status == 400) { // handling the case where tag is already registered 
        console.log('NFC: Tag already exit, overwriting');
        res = (await api.tagPost({tagPOSTModel: {barcode, uid: nfcTag.uid, overwrite: true}})) as any;
        if (nfcTag.supportsPasswordProtection) {
          let password = [...Buffer.from(res.password, 'base64')] as [number, number, number, number]
          console.log('NFC: Authenticating with password:', password);
          let authStatus = await nfcTag.authenticateForWriting(password);
          console.log('NFC: Authentication status', authStatus);  
          if (!authStatus) {
            throw 'Problem accessing tag';
          }
        } else {
          console.log('NFC: Skip authentication as this tag does not support it');
        } 
      } else {
        throw 'Problem initializing tag';
      }
    }

    let bytes = Ndef.encodeMessage([
      Ndef.uriRecord(DEFAULT_URL),
      Ndef.record(Ndef.TNF_UNKNOWN, '', [0x78, 0x70, 2], [...Buffer.from(res.newCipher, 'base64')]),
      Ndef.record(Ndef.TNF_UNKNOWN, '', [0x78, 0x70, 1], [...Buffer.from(res.newCipher, 'base64')]),
    ]);


    console.log('NFC: Writing data ...');

    // TODO: Add error detection for this operation as far as error specification of ISO 14443 will be available
    await nfcTag.formatAndWriteNdefRecords(bytes);
      
    console.log('Password: ', res.password);

    let passOK = false
    if (nfcTag.supportsPasswordProtection) {
      let password = [...Buffer.from(res.password, 'base64')] as [number, number, number, number]
      console.log('NFC: Writing password: ', password);
      passOK = await nfcTag.setPasswordForWriting(password);
      console.log('NFC: Password succeeded?: ', passOK);
    } else {
      passOK = true
    }

    if (passOK) {
      // Generally we should not call tagUidPut() by any error during write because the tag will be not rewritable 
      // And the only way would be the removal of tag from portal database 
      // It is expected that the most frequent case - too early removal of the smartphone will result in "transceive error"
      // which will be caught by catch below. however currently not all operations with the tag are checked on error in response
      // This could/should be enhanced later
      let putResult = await api.tagUidPut({tagUIDPutModel: {newCipher: res.newCipher, location}, uid: nfcTag.uid});
      console.log('Scan recorded', putResult);
      setSuccess();
    }  else {
      throw 'Could not write the tag.';
    } 

    
  } catch (ex) {
    if (ex.status == 422) {
      setError('This Tag is not supported yet');
    } else if (ex.status == 402) {
      setError('Tag is already registered. To verify tag, please use scanning function in this app');
    } else if (ex.status == 403) {
      setError('This tag can not be registered because it has already been registered by another brand');
    } else if (ex.status) {
      setError('Server Error. CODE: ' + ex.status);
    } else if (ex == 'cancelled') {
    } else {
      setError(ex?.message || ex);
    }
  } finally {
    NFCOperationManager.cancelRequest()
  }
}

export function useProductWrite() {
  const {barcode} = useSelector((state: StateType) => state.productRegistration);
  const {user} = useSelector((state: StateType) => state.auth);
  const [successType, setSuccessType] = useState<'initial' | 'success' | 'error' | 'writing'>('initial');
  const [error, setError] = useState('');
  const [active, setActive] = useState(false);
  const location = useSelector((state: StateType) => state.settings.settings.location);

  useEffect(() => {
    NFCOperationManager.start()
    return () => {
      NFCOperationManager.stop()
    };
  }, []);

  return {
    writeTag: () => {
      setActive(true);
      setSuccessType('initial');
      writeNdef(
        user!.token,
        barcode!,
        (error) => {
          setSuccessType('error');
          setError(error);
          setActive(false);
        },
        () => {
          setSuccessType('success');
          setActive(false);
        },
        () => setSuccessType('writing'),
        location,
      );
    },
    reset: () => {
      setActive(false);
      setSuccessType('initial');
      NFCOperationManager.stop();
    },
    successType,
    errorMessage: error,
    active,
  };
}
