import { jsPDF } from "jspdf";

const generatePdf = (data) => {
    const doc = new jsPDF();
    doc.setFont("Times", "normal");
    const amountText = `Total Amount: Rs. ${String(data.amount)}`;
    doc.text("Delivery Receipt", 20, 20);

    doc.text(`Sender: ${data.sender}`, 20, 40);
    doc.text(`Pickup: ${data.pickup}`, 20, 50);
    doc.text(`Receiver: ${data.receiver}`, 20, 60);
    doc.text(`Delivery: ${data.delivery}`, 20, 70);
    doc.text(amountText, 20, 80);

    doc.save("receipt.pdf");


}
export default generatePdf