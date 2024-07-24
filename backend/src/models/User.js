import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  password: { type: String  },
  email:{type: String, required:true,unique: true},
});

export default mongoose.model('Voosh-User', userSchema);
