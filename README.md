# 🚚 Courier Bill Generator (ShipX)

## 📌 Overview

ShipX is a courier consignment web application that allows users to create delivery orders through a multi-step form, generate a downloadable PDF receipt, and (now) includes a backend setup for storing data using MongoDB.

---

## ✨ Features

### 🧾 Multi-Step Consignment Form

* 5-step workflow:

  * Pickup
  * Delivery
  * Package
  * Pricing
  * Review
* Step navigation with progress tracking
* Clean and responsive UI

---

### ⚡ Dynamic Form Handling

* Centralized form state using React `useState`
* Generic input handler using `name` attributes
* Efficient and scalable state updates

---

### 🤖 Autofill System

* Selecting a sender auto-fills:

  * Phone number
  * Pickup address
  * Receiver details
* Implemented using local dataset matching

---

### 🔢 Smart Calculations

* Proper handling of numeric inputs (`price`, `weight`)
* Prevents `NaN` errors
* Safe calculation:

```js
(form.weight || 0) * (form.price || 0)
```

---

### 📄 PDF Generation

* Integrated **jsPDF**
* Generates a downloadable **Delivery Receipt**
* Includes:

  * Sender
  * Pickup
  * Receiver
  * Delivery
  * Total Amount

---

### 🔄 Form Reset

* After submission:

  * PDF is generated
  * Form resets to initial state
  * Step resets to start

---

## 🛠 Tech Stack

### Frontend

* React
* Tailwind CSS
* jsPDF

### Backend (New)

* Node.js
* Express.js
* MongoDB

---

## 📁 Project Structure

```plaintext
CourierBill/
│
├── frontend/
│   └── src/
│       └── features/
│           ├── authentication/
│           ├── dashboard/
│           └── consignment/
│               ├── pages/
│               │    └── Order.jsx
│               ├── services/
│               └── utils/
│                    └── pdfGenerator.js
│
├── backend/
│   ├── src/
│   │   ├── connection/
│   │   │    └── db.js
│   │   ├── model/
│   │   └── app.js
│   └── server.js
│
└── README.md
```

---

## 🐛 Issues Fixed

* Fixed `preventDefault` error in button handler
* Corrected login response handling
* Fixed React navigation warning
* Resolved PDF encoding issue (`₹` → `Rs.`)
* Handled number conversion properly
* Prevented `NaN` in calculations
* Improved state structure using `initialForm`

---

## 🚀 Current Status

✔ Multi-step consignment form working
✔ Autofill system implemented
✔ PDF generation functional
✔ Backend initialized with MongoDB connection
✔ Clean and modular project structure

---

## 🔜 Next Steps

* Connect frontend with backend API
* Store consignments in database
* Build order history page
* Improve PDF into invoice-style layout
* Add authentication and authorization
* Deploy application

---

## 📌 Notes

* Used `"Rs."` instead of `₹` due to jsPDF font limitations
* Backend structure prepared for scalability
* Code written with modular and maintainable practices

---

## 📷 Future Enhancements

* Add backend models for consignments and related data
* Implement data upload/storage to MongoDB
* Restructure and optimize the multi-step form for better scalability and maintainability

---

## ✅ Conclusion

This project demonstrates a full-stack courier management flow with a structured frontend, dynamic form handling, PDF generation, and a scalable backend setup. 