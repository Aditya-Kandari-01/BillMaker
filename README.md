# 🚚 BillMaker (ShipX UI)

BillMaker is a **React-based frontend prototype** for creating and managing delivery consignments.  
It simulates a delivery workflow where users can log in, create shipment orders, review details, and generate PDF receipts.

---

## ✨ Features (Frontend)

- 🔐 **Login UI**
  - Simple email/password login
  - Redirects to dashboard on success

- 🏠 **Dashboard (Home)**
  - Online / Offline toggle
  - Delivery stats (orders, earnings, rating)
  - Quick actions (New Consignment, Past Orders, etc.)

- 📦 **Consignment Form**
  - 3-column layout (Sender | Receiver | Package)
  - Auto-fill sender details from sample data
  - Pincode-based city/state autofill (via API)

- 👀 **Review Screen**
  - Displays complete order summary before confirmation

- 📄 **PDF Generation**
  - Generates delivery receipt using **jsPDF**
  - Includes sender, receiver, package & pricing details

---

## 🛠️ Tech Stack

- **React**
- **React Router DOM**
- **JavaScript (ES6+)**
- **CSS (Custom Dark Theme UI)**
- **jsPDF** (for PDF generation)
- **Postal Pincode API** (for location autofill)

---

## 🚀 Getting Started

```bash
git clone https://github.com/Aditya-Kandari-01/BillMaker.git
cd BillMaker

npm install
npm start