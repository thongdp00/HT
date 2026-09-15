import fs from 'fs';

const tail = fs.readFileSync('./app_code.js', 'utf8');

const matches = tail.match(/"([^"\\]{3,80})"/g) || [];
const vnWords = ['Kênh', 'kênh', 'Danh sách', 'Cài đặt', 'Tìm kiếm', 'Thể loại', 'Yêu thích', 'Tải lại', 'Thoát', 'Âm lượng', 'Chất lượng', 'Tỷ lệ', 'Toàn màn hình', 'Phím', 'DRM', 'Trực tiếp'];

const found = matches.filter(m => vnWords.some(w => m.includes(w)));
console.log('Found TV UI terms:', [...new Set(found)]);
