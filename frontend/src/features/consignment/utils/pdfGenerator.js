import { jsPDF } from "jspdf";

const generatePdf = (data = {}) => {
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 12;
  const rightX = pageWidth - marginX;
  const contentWidth = pageWidth - marginX * 2;

  const line = (y) => doc.line(marginX, y, rightX, y);

  const safe = (value, fallback = "-") => {
    if (value === null || value === undefined || value === "") return fallback;
    return String(value);
  };

  const money = (value) => {
    const num = Number(value);
    if (Number.isNaN(num)) return "-";
    return num.toFixed(2);
  };

  const addWrappedText = (text, x, y, width, lineHeight = 5) => {
    const lines = doc.splitTextToSize(safe(text), width);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  const addBox = (x, y, w, h) => {
    doc.rect(x, y, w, h);
  };

  const addSectionTitle = (title, y) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, marginX, y);
    doc.setFont("helvetica", "normal");
    return y + 5;
  };

  const drawHeader = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("TAX INVOICE", marginX, 14);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const company = data.company || {};
    const invoice = data.invoice || {};

    const leftStartY = 20;
    let y = leftStartY;

    doc.setFont("helvetica", "bold");
    doc.text(safe(company.name, "R. S COURIER"), marginX, y);
    doc.setFont("helvetica", "normal");
    y += 5;

    y = addWrappedText(
      company.address ||
        "M.J Market Kicha Road Near Axis Bank, Sitarganj",
      marginX,
      y,
      85
    ) + 1;

    y = addWrappedText(
      `${safe(company.city, "Sitarganj")}, ${safe(company.state, "Uttarakhand")} - ${safe(company.pincode, "262405")}`,
      marginX,
      y,
      85
    ) + 1;

    y = addWrappedText(
      `GST No: ${safe(company.gstNo, "—")}    PAN No: ${safe(company.panNo, "—")}`,
      marginX,
      y,
      85
    ) + 1;

    y = addWrappedText(
      `Email: ${safe(company.email, "—")}    Contact: ${safe(company.contact, "—")}`,
      marginX,
      y,
      85
    );

    // Right side invoice meta box
    const boxX = 126;
    const boxY = 12;
    const boxW = 72;
    const boxH = 38;
    addBox(boxX, boxY, boxW, boxH);

    doc.setFont("helvetica", "bold");
    doc.text(`Invoice No: ${safe(invoice.number, "1977")}`, boxX + 4, boxY + 8);
    doc.text(`Invoice Date: ${safe(invoice.date, "03/04/2026")}`, boxX + 4, boxY + 15);
    doc.text(`State Code: ${safe(invoice.stateCode, "05")}`, boxX + 4, boxY + 22);
    doc.text(`Place of Supply: ${safe(invoice.placeOfSupply, "SITARGANJ")}`, boxX + 4, boxY + 29);
    doc.text(`HSN/SAC: ${safe(invoice.hsnSac, "996812")}`, boxX + 4, boxY + 36);

    doc.setFont("helvetica", "normal");

    return 56;
  };

  const drawBillTo = (startY) => {
    const billTo = data.billTo || {};
    const shipTo = data.shipTo || {};

    const leftX = marginX;
    const topY = startY;
    const colW = 90;
    const colH = 42;

    addBox(leftX, topY, colW, colH);
    addBox(leftX + colW + 8, topY, colW, colH);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Bill To", leftX + 3, topY + 7);
    doc.text("Ship To / Consignee", leftX + colW + 11, topY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    let y1 = topY + 13;
    y1 = addWrappedText(`Name: ${safe(billTo.name, "SHANMUKH SUPPLY CHAIN PRIVATE LIMITED")}`, leftX + 3, y1, colW - 6) + 1;
    y1 = addWrappedText(`Address: ${safe(billTo.address, "FLAT NO.466, ADARSH APARTMENT, POCKET-16, SECTOR-03, DWARKA, SOUTH WEST DELHI, DELHI, 110078")}`, leftX + 3, y1, colW - 6) + 1;
    y1 = addWrappedText(`GST No: ${safe(billTo.gstNo, "07ABFCS0910C1ZW")}`, leftX + 3, y1, colW - 6) + 1;
    y1 = addWrappedText(`PAN No: ${safe(billTo.panNo, "ABFCS0910C")}`, leftX + 3, y1, colW - 6);

    let y2 = topY + 13;
    y2 = addWrappedText(`Name: ${safe(shipTo.name, "SHANMUKH SUPPLY CHAIN PRIVATE LIMITED")}`, leftX + colW + 11, y2, colW - 6) + 1;
    y2 = addWrappedText(`Address: ${safe(shipTo.address, "REGISTERED ADDRESS SAME AS ABOVE")}`, leftX + colW + 11, y2, colW - 6) + 1;
    y2 = addWrappedText(`Place of Supply: ${safe(shipTo.placeOfSupply, "SITARGANJ")}`, leftX + colW + 11, y2, colW - 6) + 1;
    y2 = addWrappedText(`State Code: ${safe(shipTo.stateCode, "05")}`, leftX + colW + 11, y2, colW - 6);

    return topY + colH + 6;
  };

  const drawTableHeader = (y) => {
    const cols = [
      { title: "S.No", w: 9 },
      { title: "AWB No.", w: 24 },
      { title: "Date", w: 18 },
      { title: "Destination", w: 25 },
      { title: "Pcs", w: 9 },
      { title: "Weight", w: 16 },
      { title: "Amount", w: 18 },
      { title: "Network", w: 18 },
      { title: "Mode", w: 16 },
      { title: "Origin", w: 20 },
      { title: "Consignee", w: 35 },
    ];

    const xPositions = [];
    let x = marginX;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);

    cols.forEach((col) => {
      xPositions.push(x);
      doc.rect(x, y, col.w, 8);
      doc.text(col.title, x + 1, y + 5.5);
      x += col.w;
    });

    return { nextY: y + 8, cols, xPositions };
  };

  const drawShipmentRows = (startY) => {
    const rows =
      data.shipments ||
      data.items ||
      [];

    const defaultRows = [
      {
        sno: 1,
        awb: "515670763850",
        date: "02/03/2026",
        destination: "REWARI",
        pcs: 20,
        weight: 140,
        amount: 1650.96,
        network: "BLUE DART",
        mode: "SURFSTR",
        origin: "",
        consignee: "SHIVANI JAIN",
      },
    ];

    const tableRows = rows.length ? rows : defaultRows;

    const rowH = 8;
    let y = startY;

    const ensurePage = (neededHeight = rowH) => {
      if (y + neededHeight > pageHeight - 25) {
        doc.addPage();
        y = 12;
        const header = drawTableHeader(y);
        y = header.nextY;
        return true;
      }
      return false;
    };

    const header = drawTableHeader(y);
    y = header.nextY;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);

    tableRows.forEach((row, index) => {
      ensurePage(rowH);

      const values = [
        safe(row.sno ?? index + 1),
        safe(row.awb ?? row.awbNo),
        safe(row.date),
        safe(row.destination),
        safe(row.pcs),
        safe(row.weight),
        money(row.amount),
        safe(row.network),
        safe(row.mode),
        safe(row.origin),
        safe(row.consignee),
      ];

      let x = marginX;
      const widths = header.cols.map((c) => c.w);

      widths.forEach((w, i) => {
        doc.rect(x, y, w, rowH);
        const txt = values[i];
        const textY = y + 5.2;
        doc.text(String(txt).slice(0, 30), x + 1, textY, { maxWidth: w - 2 });
        x += w;
      });

      y += rowH;
    });

    return y + 4;
  };

  const drawSummary = (startY) => {
    const totals = data.totals || {};
    const charges = data.charges || {};

    let y = startY;
    addBox(marginX, y, contentWidth, 38);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Summary", marginX + 3, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const left = marginX + 3;
    const mid = marginX + 95;
    let yy = y + 12;

    doc.text(`Total Shipments: ${safe(totals.totalShipments, data.shipments?.length || 88)}`, left, yy);
    doc.text(`Total AWB: ${safe(totals.totalAwb, data.totalAwb || 170)}`, left, yy + 6);
    doc.text(`Other Charges: Rs. ${money(charges.otherCharges ?? data.otherCharges ?? 7675)}`, mid, yy);
    doc.text(`Fuel Surcharge: Rs. ${money(charges.fuelSurcharge ?? data.fuelSurcharge ?? 97329.27)}`, mid, yy + 6);

    doc.setFont("helvetica", "bold");
    doc.text(`Subtotal: Rs. ${money(totals.subtotal ?? data.subtotal ?? 105004.27)}`, left, yy + 18);
    doc.text(`Grand Total: Rs. ${money(totals.grandTotal ?? data.grandTotal ?? 123905.00)}`, mid, yy + 18);

    return y + 44;
  };

  const drawAmountInWords = (startY) => {
    const words =
      data.amountInWords ||
      "INR : ONE LAKH TWENTY THREE THOUSANDS NINE HUNDRED FIVE ONLY";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Amount in Words:", marginX, startY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const nextY = addWrappedText(words, marginX + 35, startY, contentWidth - 35);

    return nextY + 2;
  };

  const drawTermsAndBank = (startY) => {
    const terms = data.terms || [
      "1. This invoice includes SGST @ 9.0% and CGST @ 9.0%.",
      "2. Payment due on receipt of this bill.",
      "3. All disputes are subject to Delhi jurisdiction.",
      "4. Bill not paid by due date will attract 20% interest.",
      "E. & O. E.",
    ];

    const bank = data.bank || {};

    let y = startY;

    addBox(marginX, y, contentWidth, 52);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Terms & Conditions", marginX + 3, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);

    let ty = y + 12;
    terms.forEach((t) => {
      ty = addWrappedText(t, marginX + 3, ty, contentWidth - 6, 4.5) + 1;
    });

    y += 58;

    addBox(marginX, y, contentWidth, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Bank Details", marginX + 3, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    const leftLabelX = marginX + 3;
    const leftValueX = marginX + 36;
    let by = y + 13;

    doc.text("Beneficiary Name", leftLabelX, by);
    doc.text(":", leftValueX, by);
    doc.text(safe(bank.beneficiaryName, "SHANMUKH SUPPLY CHAIN PRIVATE LIMITED"), leftValueX + 4, by);

    doc.text("Bank Name", leftLabelX, by + 6);
    doc.text(":", leftValueX, by + 6);
    doc.text(safe(bank.bankName, "AXIS BANK"), leftValueX + 4, by + 6);

    doc.text("Bank Add.", leftLabelX, by + 12);
    doc.text(":", leftValueX, by + 12);
    doc.text(safe(bank.bankAddress, "UTTAM NAGAR, NEW DELHI, 110059"), leftValueX + 4, by + 12);

    doc.text("Account No.", leftLabelX, by + 18);
    doc.text(":", leftValueX, by + 18);
    doc.text(safe(bank.accountNo, "921020002245618"), leftValueX + 4, by + 18);

    doc.text("IFSC Code", leftLabelX, by + 24);
    doc.text(":", leftValueX, by + 24);
    doc.text(safe(bank.ifsc, "UTIB0000696"), leftValueX + 4, by + 24);

    return y + 48;
  };

  const drawFooter = () => {
    const footerY = pageHeight - 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("This is a computer generated invoice. No signature required.", marginX, footerY);
  };

  // Build PDF
  let y = drawHeader();
  y = drawBillTo(y);
  y = drawShipmentRows(y);
  y = drawSummary(y);
  y = drawAmountInWords(y);
  y = drawTermsAndBank(y);

  // Add a second page only if needed for footer overflow content
  if (y > pageHeight - 20) {
    doc.addPage();
    drawFooter();
  } else {
    drawFooter();
  }

  doc.save(safe(data.fileName, "invoice.pdf"));
};

export default generatePdf;