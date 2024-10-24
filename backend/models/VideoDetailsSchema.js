const mongoose = require('mongoose');

const uploadSchema = mongoose.Schema({
  mission:{type:String, default:"M001"},
  upload_title: { type: String, required: true },
  video_path: { type: String, required: true },
},
{timestamps:true,}
);

module.exports = mongoose.model('Upload', uploadSchema);