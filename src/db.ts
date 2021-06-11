import Mongoose from 'mongoose';

const defaultOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};

export const connect = async ({ url, options } : { url: string, options: string }) => {
    const connectionString = `${url}?${options}`;
    return Mongoose.connect(connectionString, defaultOptions);
};

export const disconnect = async () => {
    await Mongoose.disconnect();
};