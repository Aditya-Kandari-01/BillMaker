import { jsPDF } from "jspdf";

const generatePdf = (data) => {
  const doc = new jsPDF();
  doc.setFont("Times", "normal");

  doc.setFontSize(18);
  doc.text("Delivery Receipt", 20, 20);

  doc.setFontSize(12);

  // ─── Sender ───
  doc.text("Sender Details:", 20, 35);
  doc.text(`Name: ${data.sender.name}`, 20, 45);
  doc.text(`Phone: ${data.sender.phone}`, 20, 52);
  doc.text(`Address: ${data.sender.address}`, 20, 59);
  doc.text(`City: ${data.sender.city}`, 20, 66);
  doc.text(`State: ${data.sender.state}`, 20, 73);
  doc.text(`Pincode: ${data.sender.pincode}`, 20, 80);
  doc.text(`AWB: ${data.sender.awb}`, 20, 87);

  // ─── Receiver ───
  doc.text("Receiver Details:", 20, 105);
  doc.text(`Name: ${data.receiver.name}`, 20, 115);
  doc.text(`Phone: ${data.receiver.phone}`, 20, 122);
  doc.text(`Address: ${data.receiver.address}`, 20, 129);
  doc.text(`City: ${data.receiver.city}`, 20, 136);
  doc.text(`State: ${data.receiver.state}`, 20, 143);
  doc.text(`Pincode: ${data.receiver.pincode}`, 20, 150);
  doc.text(`AWB: ${data.receiver.awb}`, 20, 157);

  // ─── Package ───
  doc.text("Package Details:", 20, 175);
  doc.text(`Type: ${data.package.type}`, 20, 185);
  doc.text(`Weight: ${data.package.weight} kg`, 20, 192);
  doc.text(`Rate: Rs. ${data.package.pricePerKg} / kg`, 20, 199);

  // ─── Total ───
  doc.setFontSize(14);
  doc.text(`Total Amount: Rs. ${data.amount}`, 20, 215);

  // Date
  doc.setFontSize(10);
  doc.text(`Date: ${data.date}`, 150, 20);

  doc.save("receipt.pdf");
};

export default generatePdf;