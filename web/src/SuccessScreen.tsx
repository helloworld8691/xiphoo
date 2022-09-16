import React, { useState } from 'react';
import './SuccessScreen.scss';
import logo from './logo_white.svg';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { brandLogo, productImage } from './images';
import type { Product, Result } from './types';

// const brandName = 'Timberlands';
// const productName = 'Timberlands';
// const colorName = 'green';
// const sizeName = 'xs';
// // const brandUrl =
// //   'https://www.xiphoo.com/customer/maiersports/products/230016-900/';
// const brandUrl = null;

const errorRed = '#D55555';
const mainGreen = '#006837';

export function SuccessScreen({
  result,
  onReset,
}: {
  result: Result;
  onReset: () => void;
}) {
  console.log(
    '🚀 ~ file: SuccessScreen.tsx ~ line 21 ~ SuccessScreen ~ result',
    result,
  );
  const [popupVisible, setPopupVisible] = useState(false);

  const { tagInfo, product } = result;

  const {
    brandName,
    colorName,
    productName,
    sizeName,
    brandLogo,
    productImage,
    productURL,
  } = product || ({} as Product);

  const {ean, category,sku, description, gender, subCategory} = product?.productDetails ?? {};

  const [loading, setLoading] = useState(true);


    var productLink = "";

      if(product?.productURL != null && product?.productURL != "")
  {
     productLink = product.productURL;
     productLink += "?brand_name="+brandName;
     productLink += "&brand_img="+brandLogo;
     productLink += "&color="+colorName;
     productLink += "&product_img="+productImage;
     productLink += "&product_name="+productName;
     productLink += "&size="+sizeName;
     productLink += "&ean="+ean;
     productLink += "&sku="+sku;
     productLink += "&description="+description;
     productLink += "&gender="+gender;
     productLink += "&category="+category;
     productLink += "&subCategory="+subCategory;

  }


  return (
    <div className="container-white">
      <div className="dark-header">
        <div
          style={{
            width: 50,
          }}
        ></div>
        <div
          className="original-con"
          style={{ background: tagInfo.onlineCheck ? mainGreen : errorRed }}
          onClick={() => setPopupVisible(true)}
        >
          <div>
            {/* {tagInfo.onlineCheck
              ? 'Product is original'
              : 'Product could be fake'} */}
            Product info
          </div>
        </div>
        <div className="logo-con" onClick={onReset}>
          <img src={logo} width="80%" height="80%" />
        </div>
      </div>
      <div
        className="product-content-con"
        style={{ maxHeight: 'calc(100vh - 76px)' }}
      >
        {productLink && (
          <>
            {loading && (
              <CircularProgress variant="indeterminate" sx={{ m: 5 }} />
            )}
            <iframe
              src={productLink}
              width="100%"
              style={{ flex: 1 }}
              onLoad={() => setLoading(false)}
            ></iframe>
          </>
        )}
        {!productURL && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              overflowY: 'scroll',
            }}
          >

               {brandName && <h1 style={{ marginTop: 32 }}>Marke: {brandName}</h1>}
                                {productName && <h2>Modell: {productName}</h2>}
                                {colorName && <h3>Farbe: {colorName}</h3>}
                                {sizeName && <h3>Größe: {sizeName}</h3>}



            {brandLogo && (
              <img
                className="brand-logo"
                src={brandLogo}
                height="auto"
                style={{ height: '15vw' }}
              />
            )}
            {productImage && (
              <img className="product-image" src={productImage} />
            )}

            <div
              style={{ paddingTop: 200, width: '100%', background: 'white' }}
            ></div>
          </div>
        )}
      </div>
      <ScanningPopup
        open={popupVisible}
        onClosePress={() => setPopupVisible(false)}
        result={result}
      />
    </div>
  );
}

export const ScanningPopup = ({
  open,
  onClosePress,
  result,
}: {
  open: boolean;
  onClosePress: () => void;
  result: Result;
}) => {
  const { tagInfo, laps, product } = result;
  const productDetails = [
    { title: 'Brand Name: ', text: product?.brandName },
    { title: 'Product Name: ', text: product?.productName },
    { title: 'Color Name: ', text: product?.colorName },
    { title: 'Size Name: ', text: product?.sizeName },
    { title: 'Gender: ', text: product?.productDetails?.gender },
    { title: `SKU: `, text: product?.productDetails?.sku },
    { title: `EAN: `, text: product?.productDetails?.ean },
    { title: `Category: `, text: product?.productDetails?.category },
    { title: `Sub Category: `, text: product?.productDetails?.subCategory },
    {
      title: `Category 3: `,
      text: product?.productDetails?.furtherSubCategory,
    },
    { title: `Origin: `, text: product?.productDetails?.origin },
    { title: `Year: `, text: product?.productDetails?.year },
    { title: `Description: `, text: product?.productDetails?.description },
  ];

  const [openAccordion, setOpenAccordion] = useState<string | null>('auth');

  const openProps = (state: string) => ({
    expanded: openAccordion == state,
    onClick: () => setOpenAccordion(openAccordion == state ? null : state),
  });

  return (
    <Dialog
      open={open}
      onBackdropClick={onClosePress}
      fullWidth
      maxWidth={'lg'}
      PaperProps={{ sx: { marginX: 1, width: 'calc(100% - 8px)' } }}
    >
      <DialogTitle>Scanning Details</DialogTitle>
      <DialogContent sx={{ padding: '8px' }}>
        <Accordion {...openProps('auth')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="button">Authenticity</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack>
              <FormControlLabel
                control={<Checkbox checked={result.tagInfo.xiphooTag} />}
                label="Xiphoo Tag"
              />
              <FormControlLabel
                control={<Checkbox checked={result.tagInfo.offlineCheck} />}
                label="Offline Check"
              />
              <FormControlLabel
                control={<Checkbox checked={result.tagInfo.onlineCheck} />}
                label="Online Check"
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion {...openProps('details')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="button">Product Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer sx={{ marginTop: -2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {productDetails
                    .filter((p) => p.text)
                    .map((p, i) => (
                      <TableRow key={p.title}>
                        <TableCell>{p.title}</TableCell>
                        <TableCell align="right">{p.text as string}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
        {(product?.productDetails?.components?.length || 0 > 0) && (
          <Accordion {...openProps('material')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="button">Materials</Typography>
            </AccordionSummary>
            <AccordionDetails></AccordionDetails>
            <TableContainer sx={{ marginTop: -2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {product?.productDetails?.components?.map((c, i) => (
                    <TableRow key={`${c.name}`}>
                      <TableCell>{`${c.name}: `}</TableCell>
                      <TableCell align="right">
                        {c.materials
                          .map((v) => `${v.name}: ${v.amount}%`)
                          .join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Accordion>
        )}
        {product?.productDetails?.laundry && (
          <Accordion {...openProps('washing')}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="button">Washing instructions</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer sx={{ marginTop: -2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Value</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Object.entries(product?.productDetails?.laundry)
                      .filter(([_, val]) => val !== undefined)
                      .map(([key, val], i) => (
                        <TableRow key={key}>
                          <TableCell>{`${key
                            .replace(/^([a-z])/, ($1: string) =>
                              $1.toUpperCase(),
                            )
                            .replace(/([a-z])([A-Z])/, '$1 $2')}: `}</TableCell>
                          <TableCell align="right">
                            <Typography>{val!.text} </Typography>
                            <img height="24px" width="24px" src={val!.symbol} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}
        <Box height={16} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClosePress}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
