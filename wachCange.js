
const mongoose = require("mongoose");
const sendNotification = require("./sendTg");
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI);

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now } // Дата создания заказа
});

// Модель для заказа
const Order = mongoose.model('Order', orderSchema);



async function watchChanges() {
    console.log("Начинаем отслеживание изменений в MongoDB...");


    const changeStream = Order.watch();

    changeStream.on("change", (change) => {
        console.log("Изменение в БД:", change);
        sendNotification(`🔔 Обновление в БД:\n\n${JSON.stringify(change, null, 2)}`);
    });
}

watchChanges();
