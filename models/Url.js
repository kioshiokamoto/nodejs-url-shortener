import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    urlCode: String,
    longUrl: String,
    shortUrl: String,
    clickCount: Number
});

const Url = mongoose.model("Url", urlSchema);
export default Url;
