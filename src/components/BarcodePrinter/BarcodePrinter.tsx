import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@saleor/macaw-ui-next';
import Barcode from 'react-barcode';
import { useIntl } from 'react-intl';

export interface BarcodeProps {
    title?: string;
    value: string;
}

export interface BarcodePrinterProps {
    barcodes: BarcodeProps[];
    print: boolean;
    onPrint: () => void;
}

{/* Example
  const barcodes = [
  { title: '标签1', value: '123456789012' },
  { title: '标签2', value: '987654321098' },
  { value: '1111233098' },
  ];

  return (
    <BarcodePrinter barcodes={barcodes} />
  );
  
*/}

const BarcodePrinter: React.FC<BarcodePrinterProps> = ({ barcodes, print, onPrint }) => {
    const intl = useIntl();
    const barcodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [heights, setHeights] = useState<number[]>([]);

    useEffect(() => {
        const newHeights = barcodeRefs.current.map(ref => ref!.offsetHeight + 54 || 0);
        setHeights(newHeights);
    }, [barcodes]);

    useEffect(() => {
        if (print) {
            onPrint();
            printBarcodes();
        }
    }, [print]);

    const printBarcodes = () => {
        const pageWidth = 800;
        const pageHeight = 900;
        const printWindow = window.open('', '_blank', `width=${pageWidth},height=${pageHeight}`);
        if (printWindow) {
            printWindow.document.write('<html><head><title>Barcodes</title></head><body>');
            printWindow.document.write(`
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .barcode-container { display: flex; flex-wrap: wrap; justify-content: space-between; }
          .barcode-item { border: 1px solid black; padding: 8px; text-align: center; width: calc(50% - 10px); box-sizing: border-box; margin-right: 20px; }
          .barcode-item:nth-child(even) { margin-right: 0; }
          .barcode-title { margin-bottom: 10px; font-weight: bold; }
          .barcode { margin: 10px 0; }
          .barcode-number { margin-top: 8px; }
          @media print { .page-break { display: block; page-break-before: always; } }
        </style>
      `);

            let currentHeight = 0;
            let rowHtml = '';

            barcodes.forEach((barcode, index) => {
                const barcodeHtml = barcodeRefs.current[index]?.innerHTML;
                const barcodeHeight = heights[index] || 0;
                if (barcodeHtml) {
                    rowHtml += `
            <div class="barcode-item">
              <div class="barcode-title">
                ${barcode.title ?? intl.formatMessage({ id: "87yghj", defaultMessage: "爱心屋物品标签" })}
              </div>
              <div class="barcode">
                ${barcodeHtml}
              </div>
            </div>
          `;

                    if ((index + 1) % 2 === 0 || index === barcodes.length - 1) {
                        if (currentHeight + barcodeHeight > pageHeight) {
                            printWindow.document.write('<div class="page-break"></div>');
                            currentHeight = 0;
                        }
                        printWindow.document.write('<div class="barcode-container">' + rowHtml + '</div>');
                        currentHeight += barcodeHeight;
                        rowHtml = '';
                    }
                }
            });

            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    return (
        <>
            {/* <Button onClick={printBarcodes}>
                {intl.formatMessage({
                    id: "esz148",
                    defaultMessage: "生成并打印",
                })}
            </Button> */}
            <div style={{ position: 'absolute', visibility: 'hidden', zIndex: -1 }}>
                {barcodes.map((barcode, index) => (
                    <div key={index} ref={el => (barcodeRefs.current[index] = el)} className="barcode-item">
                        <Barcode value={barcode.value} width={3} height={100} font="Consolas" />
                    </div>
                ))}
            </div>
        </>
    );
};

export default BarcodePrinter;
