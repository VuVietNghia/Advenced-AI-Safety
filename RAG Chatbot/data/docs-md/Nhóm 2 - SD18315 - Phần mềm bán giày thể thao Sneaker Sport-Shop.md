Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 1 | Trang

-- 1 of 124 --

## MỤC LỤC

## PHẦN 1: GIỚI THIỆU 	13

1.1 . Bối cảnh - Hiện trạng 	13

### 1.1.1 Bối cảnh 	13

### 1.1.2 Khảo sát 	14

### 1.1.3 Khảo sát Authentic Shoes 	15

### 1.2 Mục tiêu - Phạm vi 	16

### 1.3 Nguồn lực - Kế hoạch 	17

Các thành viên trong nhóm 	17
Kế hoạch xây dựng dự án 	17
Kế hoạch phân chia công việc 	18

## PHẦN 2: PHÂN TÍCH 	20

### 2.1 Yêu cầu người dùng 	20

### 2.2 Trường hợp sử dụng 	21

### 2.2.1 Danh sách tác nhân 	21

### 2.2.2 Danh sách Use Case 	22

2.2.3 Đặc tả Use Case 	25

### 2.2.3.1 Bán hàng 	25

### 2.2.3.2 Quản lý hóa đơn 	36

### 2.2.3.3 Quản lý sản phẩm 	47

### 2.2.3.4 Quản lý voucher 	56

### 2.2.3.5 Quản lý khách hàng 	67

### 2.2.3.6 Quản lý nhân viên 	76

### 2.2.3.7 Thống kê doanh thu 	85

### 2.3 Quan hệ thực thể 	88

### 2.3.1 Danh sách thực thể 	88

### 2.3.2 Các mối quan hệ 	89

### 2.3.3 Sơ đồ quan hệ thực thể 	91

## PHẦN 3: THIẾT KẾ 	92

### 3.1 Kiến trúc hệ thống 	92

### 3.2 Cơ sở dữ liệu 	92

Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 0 | Trang

-- 2 of 124 --

### 3.2.1 Chuẩn hóa 	92

### 3.2.2 Danh sách bảng 	92

3.2.3 Đặc tả bảng 	95

### 3.3 Giao diện người dùng 	114

### 3.3.1 Sơ đồ giao diện 	114

### 3.3.2 Giao diện phác thảo 	114

## PHẦN 4: THỰC THI 	118

### 4.1 Tổ chức mã nguồn 	118

### 4.1.1 Sơ đồ tổ chức 	118

### 4.1.2 Thư viện sử dụng 	118

4.2 Đặc tả chức năng 	119

## KIỂM THỬ 	120

### 4.3 Kế hoạch kiểm thử 	120

### 4.3.1 Tiêu chí cần đạt 	120

### 4.3.2 Chiến lược triển khai 	121

### 4.4 Thống kê kết quả 	121

Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 1 | Trang

-- 3 of 124 --

## MỤC LỤC ẢNH

Hình 1: Use case tổng 	22
Hình 2: Use case bán hàng 	25
Hình 3: Activity Diagram bán hàng(1) 	27
Hình 4: Activity Diagram bán hàng(2) 	29
Hình 5: Activity Diagram bán hàng(3) 	31
Hình 6: Activity Diagram bán hàng(4) 	33
Hình 7: Activity Diagram bán hàng(5) 	35
Hình 8: Use case quản lý hóa hóa đơn 	36
Hình 9: Activity Diagram quản lý hóa đơn(1) 	38
Hình 10: Activity Diagram quản lý hóa đơn(2) 	40
Hình 11: Activity Diagram quản lý hóa đơn(3) 	42
Hình 12: Activity Diagram quản lý hóa đơn(4) 	43
Hình 13: Activity Diagram quản lý hóa đơn(5) 	46
Hình 14: Use case quản lý sản sản phẩm 	47
Hình 15: Activity Diagram quản lý sản phẩm(1) 	49
Hình 16: Activity Diagram quản lý sản phẩm(2) 	51
Hình 17: Activity Diagram quản lý sản phẩm(3) 	53
Hình 18: Activity Diagram quản lý sản phẩm(4) 	55
Hình 19: Use case quản lý voucher 	56
Hình 20: Activity Diagram quản lý voucher(1) 	58
Hình 21: Activity Diagram quản lý voucher(2) 	60
Hình 22: Activity Diagram quản lý voucher(3) 	62
Hình 23: Activity Diagram quản lý voucher(4) 	64
Hình 24: Activity Diagram quản lý voucher(5) 	66
Hình 25: Use case quản lý khách hàng 	67
Hình 26: Activity Diagram quản lý khách hàng(1) 	69
Hình 27: Activity Diagram quản lý khách hàng(2) 	71
Hình 28: Activity Diagram quản lý khách hàng(3) 	73
Hình 29: Activity Diagram quản lý khách hàng(4) 	75
Hình 30: Use Use case quản lý nhân viên 	76
Hình 31: Activity Diagram quản lý nhân viên(1) 	78
Hình 32: Activity Diagram quản lý nhân viên(2) 	80
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 2 | Trang

-- 4 of 124 --

Hình 33: Activity Diagram quản lý nhân viên(3) 	82
Hình 34: Activity Diagram quản lý nhân viên(4) 	84
Hình 35: Use case thống kê doanh thu 	85
Hình 36: Activity Diagram thống kê doanh thu 	87
Hình 37: Mối quan hệ hệ nhân viên-hóa đơn 	89
Hình 38: Mối quan hệ nhân viên- khách hàng 	90
Hình 39: Mối quan hệ tài khoản-nhân viên 	90
Hình 40: Mối quan hệ quản lý-nhân viên 	90
Hình 41: Sơ đồ quan hệ thực thể 	91
Hình 42: Danh sách bảng 	92
Hình 43: Database 	93
Hình 44: Danh sách bảng(2) 	95
Hình 45: Danh sách bảng(3) 	99
Hình 46: Danh sách bảng(4) 	104
Hình 47: Danh sách bảng(5) 	107
Hình 48: Danh sách bảng(6) 	110
Hình 49: Màn hình bán hàng 	114
Hình 50: Màn hình quản lý hóa đơn 	115
Hình 51: Màn hình quản lý sản phẩm 	115
Hình 52:Màn hình quản lý voucher 	116
Hình 53: Màn hình quản lý khách hàng 	116
Hình 54: Màn hình quản lý nhân viên 	117
Hình 55: Màn hình thống kê doanh thu 	117
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 3 | Trang

-- 5 of 124 --

## MỤC LỤC BẢNG

Bảng 1: Quy ước tài liệu 	11
Bảng 2: Chú giải tài liệu 	12
Bảng 3: Kế hoạch khảo sát 	14
Bảng 4: Tiến hành khảo sát 	15
Bảng 5: Các thành viên trong nhóm 	17
Bảng 6: Tiến độ công việc 	19
Bảng 7: Yêu cầu cầu người dùng 	20
Bảng 8: Danh sách tác nhân 	22
Bảng 9: Các use case 	24
Bảng 10: UC-1.1 bán hàng 	26
Bảng 11: UC-1.2 bán hàng 	28
Bảng 12: UC-1.3 bán hàng 	30
Bảng 13: UC-1.4 bán hàng 	32
Bảng 14: UC-1.5 bán hàng 	34
Bảng 15: UC-2.1 Quản lý hóa đơn 	37
Bảng 16: UC-2.2 Quản lý hóa đơn 	39
Bảng 17: UC-2.3 Quản lý hóa đơn 	41
Bảng 18: UC-2.4 Quản lý hóa đơn 	43
Bảng 19: UC-2.5 Quản lý hóa đơn 	45
Bảng 20: UC-3.1 Quản lý sản phẩm 	48
Bảng 21: UC-3.2 Quản lý sản phẩm 	50
Bảng 22: UC-3.3 Quản lý sản phẩm 	52
Bảng 23: UC-3.4 Quản lý sản phẩm 	54
Bảng 24: UC-4.1 Quản lý voucher 	57
Bảng 25: UC-4.2 Quản lý voucher 	59
Bảng 26: UC-4.3 Quản lý voucher 	61
Bảng 27: UC-4.4 Quản lý voucher 	63
Bảng 28: UC-4.5 Quản lý voucher 	65
Bảng 29: UC-5.1 Quản lý khách hàng 	68
Bảng 30: UC-5.2 Quản lý khách hàng 	70
Bảng 31: UC-5.3 Quản lý khách hàng 	72
Bảng 32: UC-5.4 Quản lý khách hàng 	74
Bảng 33: UC-6.1 Quản lý nhân viên 	77
Bảng 34: UC-6.2 Quản lý nhân viên 	79
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 4 | Trang

-- 6 of 124 --

Bảng 35: UC-6.3 Quản lý nhân viên 	81
Bảng 36: UC-6.4 Quản lý nhân viên 	83
Bảng 37: UC-7.1 Thống kê doanh thu 	86
Bảng 38: Danh sách thực thể 	88
Bảng 39: Các mối quan hệ 	89
Bảng 40: Danh sách bảng 	94
Bảng 41: Bảng HoaDon 	96
Bảng 42: Bảng HoaDonChiTiet 	97
Bảng 43: Bảng SanPhamChiTiet 	98
Bảng 44: Bảng SanPham 	100
Bảng 45: Bảng DeGiay 	100
Bảng 46: Bảng Hang 	101
Bảng 47: Bảng Size 	101
Bảng 48: Bảng Mau 	102
Bảng 49: Bảng ChatLieu 	102
Bảng 50: Bảng Anh 	103
Bảng 51: Bảng NhanVien 	105
Bảng 52: Bảng VaiTro 	106
Bảng 53: Bảng Voucher 	108
Bảng 54: Bảng GiamGia_SPCT 	109
Bảng 55: Bảng KhachHang 	111
Bảng 56: Bảng KhachHang_Voucher 	112
Bảng 57: Bảng DiaChi 	113
Bảng 58: Thư viện sử dụng 	118
Bảng 59: Bảng tổng hợp kết quả kiểm thử 	121
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 5 | Trang

-- 7 of 124 --

## PHIÊN BẢN TÀI LIỆU

Tên 	Ngày 	Lý do thay đổi 	Phiên bản
Xây dựng phần mềm bán giày
Sneaker Sport-Shop 22/11/2023 	Không thay đổi 	1.0
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 6 | Trang

-- 8 of 124 --

## DANH SÁCH THÀNH VIÊN

STT 	Họ tên 	Mã sinh viên 	Số điện thoại 	Email

### 1 	Trần Công Lực 	PH35904 	0388202004 	luctcph35904@fpt.edu.vn

### 2 	Nguyễn Huy Tấn 	PH35905 	0981307227 	tannhph35905@fpt.edu.vn

### 3 	Nguyễn Văn Minh 	PH35938 	0375361435 	minhnvph35938@fpt.edu.vn

### 4 	Nguyễn Tuấn Thuật 	PH35729 	0822580083 	thuatntph35729@fpt.edu.vn

Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 7 | Trang

-- 9 of 124 --

## GIẢNG VIÊN HƯỚNG DẪN

Họ và tên: Cô Nguyễn Thúy Hằng
Cơ quan công tác: Trường CĐ FPT Polytechnic.
Điện thoại: 0981234567 	Email: hangnt169@fe.edu.vn
Ý kiến nhận xét, đánh giá của cán bộ hướng dẫn:
………………………………………………………………………………………….
………………………………………………………………………………………….
………………………………………………………………………………………….
………………………………………………………………………………………….
………………………………………………………………………………………….
………………………………………………………………………………………….
………………………………………………………………………………………….
………………………………………………………………………………………….
………………………………………………………………………………………….
………………………………………………………………………………………….
Giảng viên hướng dẫn
(Ký và ghi rõ họ tên)
Nguyễn Thúy Hằng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 8 | Trang

-- 10 of 124 --

## LỜI CẢM ƠN

Chúng em, sinh viên lớp SD18315, khóa K18.3, xin gửi lời cảm ơn chân thành nhất đến quý thầy cô
đã tận tình giảng dạy và hỗ trợ chúng em suốt chặng đường học tập tại trường.
Đặc biệt, chúng em muốn dành những lời tri ân đặc biệt cho giảng viên Nguyễn Thúy Hằng, người
đã là nguồn động viên lớn nhất cho chúng em trong quá trình thực hiện môn dự án 1.
Cô không chỉ là người hướng dẫn chuyên nghiệp mà còn là người đồng hành, luôn sẵn sàng chia sẻ
kiến thức và kinh nghiệm của mình. Sự tận tâm của cô đã giúp chúng em vượt qua mọi thách thức,
từ những vấn đề nhỏ nhất đến những khía cạnh phức tạp của dự án.
Chúng em xin cam kết sẽ giữ gìn và áp dụng những kiến thức, kỹ năng mà quý thầy cô đã truyền
đạt, để trở thành những kỹ sư và chuyên viên có ích cho xã hội. Lời dạy của quý thầy cô là nguồn
động viên lớn, là động lực mạnh mẽ để chúng em không ngừng phấn đấu và học hỏi.
Chúng em cảm ơn quý thầy cô với sự nhiệt huyết và cam kết, đã tạo nên một môi trường học tập
tích cực và đầy đủ nguồn lực cho sự phát triển của chúng em. Đặc biệt, lời tri ân sâu sắc đến giảng
viên Nguyễn Thúy Hằng, người đã là nguồn động viên quan trọng, giúp chúng em vững tin và tự tin
hơn trong hành trình chuyển giao từ lý thuyết sang thực tế.
Chúng em cảm nhận được sự nỗ lực không ngừng của quý thầy cô trong việc cập nhật thông tin, xu
hướng mới nhất trong lĩnh vực chúng em đang học. Điều này đã giúp chúng em có cái nhìn toàn
diện và sâu sắc hơn về ngành nghề của mình, đồng thời khuyến khích lòng sáng tạo và khả năng
định hình tương lai của chúng em.
Chúng em cũng biết ơn về sự quan tâm cá nhân và tạo điều kiện thuận lợi cho sự phát triển cá nhân
của từng sinh viên. Quý thầy cô không chỉ là người truyền đạt kiến thức mà còn là người đồng
hành, luôn lắng nghe, hỗ trợ và khuyến khích chúng em vượt qua những khó khăn.
Cuối cùng, chúng em xin gửi lời tri ân và ngưỡng mộ sâu sắc đến quý thầy cô, người đã góp phần
lớn vào sự thành công của chúng em. Bằng lòng biết ơn, chúng em hứa sẽ không ngừng nỗ lực,
không ngừng phát triển bản thân để trở thành những con người có ích và đóng góp tích cực cho xã
hội.
Trân trọng!
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 9 | Trang

-- 11 of 124 --

## TÓM TẮT NỘI DUNG DỰ ÁN

Hướng đến những cửa hàng bán giày những người mà có nhu cầu quản lý cửa hàng của mình , phần
mềm bán giày sneaker Sport-Shop là phần mềm có khả năng quản lý bán hàng. Phần mềm có thể
giúp người dùng theo dõi doanh số bán hàng, mà còn tạo điểm mạnh qua tính năng theo dõi sản
phẩm bán ra hàng tháng, giúp bạn hiểu rõ hơn về xu hướng mua sắm của khách hàng và tối ưu hóa
hoạt động kinh doanh.
Một trong những đặc điểm quan trọng của phần mềm là khả năng theo dõi sản phẩm bán ra hàng
tháng. Việc này không chỉ giúp người quản lý hiểu rõ về xu hướng phân phối và tiêu thụ sản phẩm
mà còn giúp họ dự đoán và ứng phó với các biến động trong nhu cầu mua sắm của khách hàng.
Thông qua việc thu thập dữ liệu chi tiết về mỗi sản phẩm, phần mềm giúp tạo ra một bức tranh toàn
diện về hiệu suất của từng sản phẩm trong kho.
Phần mềm quản lý bán giày sneaker Sport-Shop không chỉ là một công cụ hỗ trợ bán hàng mà còn
cung cấp các tính năng quan trọng khác như quản lý khách hàng, quản lý nhân viên và quản lý sản
phẩm, hình thành một hệ thống toàn diện để tối ưu hóa hoạt động kinh doanh
Một điểm đặc biệt quan trọng của phần mềm là khả năng theo dõi sản phẩm bán ra hàng tháng. Việc
này không chỉ giúp người quản lý hiểu rõ hơn về sự phân phối và tiêu thụ sản phẩm mà còn giúp họ
dự đoán và ứng phó với các xu hướng mua sắm của khách hàng. Điều này là chìa khóa để tối ưu hóa
tồn kho, đảm bảo rằng cửa hàng luôn sẵn sàng đáp ứng nhu cầu thị trường.
"Phần mềm bán giày sneaker" không chỉ là công cụ quản lý cửa hàng mà còn là nguồn thông tin quý
báu. Bằng cách kết hợp dữ liệu từ doanh số bán hàng, sản phẩm bán ra hàng tháng, và thông tin
khách hàng, người quản lý có thể đưa ra các quyết định chiến lược thông minh. Việc này giúp tối ưu
hóa doanh số bán hàng, làm giàu trải nghiệm mua sắm cho khách hàng và đồng thời duy trì một tồn
kho linh hoạt để đáp ứng nhu cầu thị trường.
Tóm lại, phần mềm quản lý bán giày sneaker Sport-Shop không chỉ là công cụ quản lý cửa hàng mà
còn là một nguồn thông tin quý báu giúp người quản lý đưa ra các quyết định chiến lược thông
minh, tối ưu hóa doanh số bán hàng và nâng cao trải nghiệm mua sắm cho khách hàng.
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 10 | Trang

-- 12 of 124 --

## QUY ƯỚC TÀI LIỆU

Font 	Times New Roman
Font-size
Title
Cỡ chữ
32
Heading 1 	18
Heading 2 	14
Heading 3 	13
Heading 4 	12
Nội dung 	12
Bảng
Định dạng 	Căn chỉnh 	Chính giữa
Đường viền
Kích cỡ 	1pt
Màu sắc 	Đen
Tiêu đề
Kiểu chữ 	In đậm
Màu nền
Nội dung 	Căn lề: Trái - 3cm, Phải - 2cm, khoảng cách dòng: 1pt
Bảng 1: Quy ước tài liệu
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 11 | Trang

-- 13 of 124 --

## CHÚ GIẢI TÀI LIỆU

STT 	Thuật ngữ/Ký hiệu 	Chú thích

### 1 	Database

Là một tập hợp các dữ liệu có tổ chức được lưu
trữ và truy cập điện tử từ hệ thống máy tính.

### 2 	CSDL 	Cơ sở dữ liệu.

### 3 	Use Case Mô tả sự tương tác đặc trưng giữa người dùng bên

ngoài và hệ thống.

### 4 	Activity Diagram Biểu đồ hoạt động là một biểu đồ hành vi để mô

tả các khía cạnh động của hệ thống.

### 5 	Class Diagram

Biểu đồ lớp, là một biểu đồ cấu trúc tĩnh mô tả
cấu trúc của hệ thống bằng cách hiển thị các lớp
của hệ thống, các thuộc tính, hoạt động của chúng
và mối quan hệ giữa các đối tượng.

### 6 	ERD 	Mô hình mối quan hệ thực thể.

### 7 	Java 	Ngôn ngữ lập trình hướng đối tượng.

### 8 	Leader 	Trưởng nhóm.

### 9 	Developer Người viết ra sản phẩm các chương trình, các

phần mềm, trang web.

### 10 	Tester

Người kiểm tra sản phẩm mà lập trình viên làm
ra, để nâng cao chất lượng sản phẩm.

### 11 	SRS 	Tài liệu đặc tả yêu cầu.

Bảng 2: Chú giải tài liệu
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 12 | Trang

-- 14 of 124 --

## PHẦN 1: GIỚI THIỆU

1.1 . Bối cảnh - Hiện trạng

### 1.1.1 Bối cảnh

Thị trường giày thể thao toàn cầu được phân loại theo sản phẩm, người dùng, kênh phân phối,
và địa lý. Các phân loại chính bao gồm giày chạy bộ, giày thể thao, giày leo núi, dành cho
nam, nữ, trẻ em, được phân phối qua cửa hàng thể thao, siêu thị, cửa hàng bán lẻ trực tuyến và
các kênh phân phối khác.
Dự kiến thị trường giày thể thao sẽ tăng từ 111,65 tỷ USD vào năm 2023 lên 140 tỷ vào năm
2028, với tốc độ tăng trưởng hàng năm (CAGR) là 4,63% trong giai đoạn 2023 - 2028. Điều
này là kết quả của sự tăng cường ý thức về sức khỏe sau đại dịch Covid-19, khi mọi người
chú ý đến tập thể dục và hoạt động ngoài trời.
Thị trường giày thể thao đang phát triển mạnh mẽ, thể hiện qua sự thay đổi trong hành vi mua
sắm của người tiêu dùng. Sự tăng thu nhập và chi tiêu cho sản phẩm nâng cao đang thúc đẩy
nhu cầu mua sắm giày thể thao. Sự hợp tác giữa nhà sản xuất và chuỗi bán lẻ cũng đóng một
vai trò quan trọng trong việc kích thích thị trường.
Trong thị trường giày thể thao, giày sneaker đang trở thành xu hướng phổ biến. Mặc dù có sự
xuất hiện của các thương hiệu nổi tiếng như Nike, Vans, Converse, Adidas, nhưng vẫn có
không gian cho các doanh nghiệp tập trung vào giày thể thao bình dân với chất lượng cao và
giá thành hợp lý. Sport-Shop có thể khai thác khoảng trống này để thu hút đối tượng khách
hàng rộng lớn.
Thị trường đối mặt với các thách thức cạnh tranh từ các sản phẩm tương đương, sự thay đổi
nhanh chóng trong xu hướng và nhu cầu của người tiêu dùng. Để nổi bật, Sport-Shop cần xây
dựng phần mềm bán hàng độc đáo với các tính năng giúp cải thiện trải nghiệm mua sắm
Với tình hình thị trường ngày càng phát triển, nhóm chúng tôi quyết định xây dựng phần mềm
bán giày sneaker Sport-Shop. Phần mềm này sẽ tập trung vào quản lý bán hàng, nhân viên,
sản phẩm trong cửa hàng, mang lại trải nghiệm mua sắm độc đáo. Các tính năng như quản lý
hàng tồn kho, khách hàng, và đặc biệt là khả năng đề xuất sản phẩm dựa trên xu hướng và sở
thích cá nhân sẽ làm phong phú trải nghiệm của khách hàng.
Thị trường giày thể thao đang có triển vọng tích cực và Sport-Shop có cơ hội để định hình
tương lai của mình trong thị trường sneaker. Việc xây dựng phần mềm Sport-Shop là một
bước quan trọng để tạo ra sự khác biệt và thu hút khách hàng, đồng thời đối mặt với thách
thức cạnh tranh và sự thay đổi nhanh chóng trong ngành.
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 13 | Trang

-- 15 of 124 --

### 1.1.2 Khảo sát

Bảng 3: Kế hoạch khảo sát
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 14 | Trang
STT 	Nội dung 	Thời gian Phụ trách 	Kết quả 	Mục đích

### 1 Chuẩn bị thông tin

yêu cầu khảo sát 01/11/2023 	Lực
Xây dựng danh
sách câu hỏi,
thông tin, yêu
cầu khảo sát
Chuẩn bị danh
sách câu hỏi
khảo sát.
2
Tìm kiếm các cửa
hàng có nhu cầu sử
dụng phần mềm để
tham gia khảo sát
01/11/2023 Tấn, Minh
Tìm được 1 số
người có nhu cầu
trải nghiệm phần
mềm
Xác định mục
tiêu và đối
tượng của khảo
sát
3
Tiến hành thu thập
dữ liệu bằng cách
trao đổi với cửa
hàng về những khó
khăn khi sử dụng
cách quản lý
truyền thống và
gửi khách hàng file
khảo sát để đánh
giá và đưa ra
những khó khăn
gặp phải.
01/11/2023 Cả nhóm
Thu thập những
khó khăn và ý
kiến của cửa
hàng
Để xác định
hiện trạng của
phần mềm.

### 4 Xử lý kết quả khảo

sát 01/11/2023 	Thuật
Xử lý các yêu
cầu cửa hàng và
thống kê thành
tài liệu để xây
dựng, phát triển
Để xác định và
xây dựng phần
mềm từ kết quả
khảo sát.

### 5 Viết báo cáo kết

quả khảo sát 01/11/2023 	Thuật Báo kết quả khảo
sát.
Tổng hợp và
báo kết quả thu
được từ khảo
sát.

-- 16 of 124 --

### 1.1.3 Khảo sát Authentic Shoes

Cửa hàng được khảo sát: Authentic Shoes
1. Bạn có sử dụng phần mềm bán hàng
nào để quản lý cửa hàng không?
Hiện tại, cửa hàng đang quản lý bằng phần mềm
quản lý cửa hàng. Tuy nhiên, phần mềm hiện tại
đang khá cũ.
2. Bạn có muốn sử dụng phần mềm này
trong tương lai không?
Có cửa hàng tôi muốn dùng phần mềm này trong
tương lai.
3. Vui lòng cho chúng tôi biết bạn quan
tâm đến những chức năng nào trong
phần mềm bán giày thể thao
sneaker?
+ Cửa hàng mong muốn có một phần mềm quản lý
mới, chuyên nghiệp hơn. Tìm kiếm và lọc sản phẩm
dễ dàng
+ Hiển thị thông tin chi tiết về sản phẩm (hình ảnh,
mô tả, giá cả, kích thước, v.v.)
+ Có thể cập nhật được trạng thái làm việc của nhân
viên.
+ Xem lại và quản lý được lịch sử mua hàng theo
hoá đơn của từng khách hàng.
4. Đánh giá mức độ quan trọng của
từng tính năng. Các tính năng bên trên đều rất quan trọng
5. Bạn cho rằng giao diện người dùng
của một phần mềm bán giày thể thao
sneaker cần có những yếu tố gì?
Theo tôi giao diện người dùng phải:
+Thiết kế trực quan và hấp dẫn
+Dễ sử dụng và dễ tìm kiếm sản phẩm
+Trải nghiệm người dùng tốt
+Tương tác dễ dàng và nhanh chóng
+Hiển thị thông tin chi tiết về sản phẩm một cách rõ
ràng
6. Bạn quan tâm đến việc tích hợp hệ
thống thanh toán trực tuyến nào
trong phần mềm?
Tôi muốn có các cách thanh toán sau:
+Thẻ tín dung.
+Ví điện tử.
+Tiền mặt.
7. Vui lòng cho chúng tôi biết mục tiêu
chính của bạn trong việc sử dụng
phần mềm bán giày thể thao sneaker
Sport-Shop.
Mục tiêu của tôi : +Tăng doanh số bán hàng
+Quản lý kho hàng hiệu quả
+Cải thiện trải nghiệm khách hàng
+Tối ưu hóa quy trình bán hàng
Bảng 4: Tiến hành khảo sát
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 15 | Trang

-- 17 of 124 --

### 1.2 Mục tiêu - Phạm vi

Xây dựng phần mềm quản lý cửa hàng hiệu quả là mục tiêu chính của dự án này. Phần mềm này sẽ
được phát triển dưới dạng phần mềm để người dùng có thể quản lý thông tin sản phẩm, quản lý
thông tin khách hàng, quản lý nhân viên, quản lý các hóa đơn, thống kê doanh thu của họ một cách
hiệu quả.
Dự án này hướng đến việc xây dựng một phần mềm quản lý cửa hàng với mục tiêu chính là cung
cấp một công cụ hiệu quả giúp người dùng dễ dàng quản lý thông tin sản phẩm, khách hàng, nhân
viên, hóa đơn, và thống kê doanh thu. Để đạt được điều này, chúng tôi tập trung vào việc phát triển
một giao diện người dùng thân thiện, đơn giản và hiệu quả để giúp người dùng thực hiện các công
việc quản lý một cách thuận lợi.
Phần mềm sẽ cung cấp khả năng kiểm soát đối với các thông tin sản phẩm, từ số lượng đến thương
hiệu, cũng như theo dõi trạng thái của các đơn hàng từ khi đặt hàng cho đến khi giao hàng. Qua đó,
người dùng có thể tạo hóa đơn tại quầy một cách dễ dàng, nhanh chóng và chính xác. Họ cũng sẽ có
khả năng nắm bắt thông tin về đơn đặt hàng và các sản phẩm được ưa chuộng của khách hàng.
Ứng dụng cũng sẽ hỗ trợ người dùng theo dõi thông tin nhân viên cũng như các chương trình
khuyến mãi và mã giảm giá đặc biệt tại cửa hàng. Chức năng thống kê doanh thu sẽ giúp họ đánh
giá hiệu suất kinh doanh, theo dõi số lượng sản phẩm đã bán ra, và phân tích mô hình mua sắm của
khách hàng.
Với sự linh hoạt và tính năng đa dạng, phần mềm này không chỉ là một công cụ quản lý hiệu quả
mà còn là một đối tác đáng tin cậy giúp cửa hàng tổ chức và tối ưu hóa mọi khía cạnh của hoạt động
kinh doanh.
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 16 | Trang

-- 18 of 124 --

### 1.3 Nguồn lực - Kế hoạch

Các thành viên trong nhóm
Stt 	Họ Tên 	Công việc 	Ghi Chú

### 1 	Trần Công Lực 	Leader, phân tích chức năng phần

mềm, coder chính, design

### 2 	Nguyễn Huy Tấn 	Coder, tester

### 3 	Trần Văn Minh 	Coder chính, phân tích database

### 4 	Nguyễn Tuấn Thuật 	Document, coder hỗ trợ

Bảng 5: Các thành viên trong nhóm
Kế hoạch xây dựng dự án
- Xác định nội dung đề tài dự án, yêu cầu người dùng.
- Thiết kế giao diện, cơ sở dữ liệu.
- Xây dựng các tính năng cơ bản của từng chức năng của phần mềm.
- Kiểm tra và kiểm thử
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 17 | Trang

-- 19 of 124 --

Kế hoạch phân chia công việc
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 18 | Trang
STT 	Task name 	Start 	Finish Resource
name

### 1 	Xác định đề tài dự án 	31/10/2023 31/10/2023 	Cả nhóm

### 2 	Khảo sát nghiệp vụ 	01/11/2023 01/11/2023 	Cả nhóm

### 3 	Phân tích yêu cầu người dùng 	01/11/2023 01/11/2023 	Cả nhóm

### 4 	Phân tích luồng chức năng 	01/11/2023 01/11/2023 	Lực

### 5 	Thiết kế Database 	11/11/2023 25/11/2023 	Minh

### 6 Vẽ sơ đồ ERD và chuẩn hóa cơ sở

dữ liệu 01/11/2023 08/11/2023 	Cả nhóm

### 7 	Thiết kế Activity Diagram 	23/11/2023 23/11/2023 	Thuật, Tấn

### 8 	Làm document dự án 	22/11/2023 29/11/2024 	Thuật

### 9 Thiết kế giao diện đăng nhập, quên

mật khẩu 07/11/2023 13/11/2023 	Lực

### 10 	Thiết kế giao diện bán hàng 	07/11/2023 13/11/2023 	Lực

### 11 	Thiết kế giao diện sản phẩm 	07/11/2023 13/11/2023 	Minh

### 12 	Thiết kế giao diện thống kê 	07/11/2023 13/11/2023 	Minh

### 13 	Thiết kế giao diện nhân viên 	07/11/2023 13/11/2023 	Minh

### 14 	Thiết kế giao diện hoá đơn 	07/11/2023 13/11/2023 	Tấn

### 15 	Thiết kế giao diện khách hàng 	07/11/2023 13/11/2023 	Thuật

### 16 	Thiết kế menu và trang chủ 	07/11/2023 13/11/2023 	Lực

### 17 	Phân quyền 	13/11/2023 16/11/2023 	Lực

18 	Đăng nhập 	13/11/2023 16/11/2023 	Lực

### 19 	Gửi mail 	13/11/2023 16/11/2023 	Minh

### 20 	Quản lý hoá đơn 	13/11/2023 21/11/2023 	Tấn

-- 20 of 124 --

Bảng 6: Tiến độ công việc 1
1
https://trello.com/invite/b/43WuROYl/ATTIafb6efa98fd25e7941f2a635fad015d77ACEC806/fpt-
poly-soprt-shop
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 19 | Trang

### 21 	Quản lý sản phẩm 	13/11/2023 23/11/2023 	Lực

### 22 	Thống kê 	13/11/2023 28/11/2023 	Minh

### 23 	Quản lý nhân viên 	13/11/2023 22/11/2023 	Minh

### 24 	Quản lý khách hàng 	13/11/2023 22/11/2023 	Thuật

### 25 Xem chi tiết hoá đơn của khách

hàng 13/11/2023 22/11/2023 	Tấn

### 26 	Xem và tìm kiếm sản phẩm 	13/11/2023 20/11/2023 	Lực

### 27 	Xem và tìm kiếm hoá đơn 	13/11/2023 23/11/2023 	Tấn

### 28 	Xem và tìm kiếm khách hàng 	13/11/2023 22/11/2023 	Thuật

### 29 	Xem và tìm kiếm nhân viên 	13/11/2023 24/11/2023 	Minh

### 30 	Test case 	22/11/2023 30/11/2023 	Tấn

-- 21 of 124 --

## PHẦN 2: PHÂN TÍCH

### 2.1 Yêu cầu người dùng

Mã Là… , 	tôi muốn… , 	để… .
US-1 Quản trị viên 	Chức năng quản lý sản phẩm 	Cho phép người quản lý tìm
kiếm, thêm, sửa, xóa sản
phẩm.
Quản lý thông tin sản phẩm.
Quản lý giá cả sản phẩm.
US-2 Quản trị viên 	Chức năng quản lý nhân viên 	Cho phép người quản lý tìm
kiếm, thêm, sửa, xóa nhân
viên.
Phân quyền nhân viên
US-3 Quản trị viên 	Chức năng quản lý phiếu giảm giá Cho phép người quản lý thêm,
sửa, xóa các phiếu giảm giá.
Quản lý số lượng phiếu giảm
giá.
Quản lý thời hạn phiếu giảm
giá.
US-4 Quản trị viên 	Chức năng thống kê doanh thu 	Giúp người quản lý có thể
thống kê doanh thu.
US-5 Người dùng hệ
thống
Chức năng quản lý đơn hàng 	Giúp người dùng hệ thống có
thể theo dõi tiến độ, tìm kiếm,
xử lý đơn hàng, hủy đơn hàng.
US-6 Người dùng hệ
thống
Chức năng quản lý khách hàng 	Giúp người dùng hệ thống có
thể tìm kiếm, thêm, xóa thông
tin khách hàng, xem lịch sử
mua hàng của khách hàng
US-7 Người dùng hệ
thống
Bán hàng 	Giúp người dùng có thể xem
đơn hàng, thông tin khách
hàng đặt, sản phẩm, tiến độ
đơn hàng, duyệt đơn hàng
Bảng 7: Yêu cầu người dùng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 20 | Trang

-- 22 of 124 --

### 2.2 Trường hợp sử dụng

### 2.2.1 Danh sách tác nhân

STT 	Tên tác nhân 	Mô tả

### 1 	Nhân viên 	Là đối tượng đăng nhập vào hệ thống, có vai trò là

“Nhân viên” có thể quản lý đơn hàng, quản lý thông tin
khách hàng, tạo hóa đơn.

### 2 	Quản lý 	Là đối tượng đã đăng nhập vào hệ thống, có vai trò là

“Quản lý”. Có thể quản lý nhân viên, quản lý phiếu
giảm giá, quản lý sản phẩm, thống kê doanh thu.
Bảng 8: Danh sách tác nhân2
2
https://drive.google.com/file/d/1JNKv0wdGI_QkChDuV-1QIn__UXoLhtIE/view?usp=sharing
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 21 | Trang

-- 23 of 124 --

### 2.2.2 Danh sách Use Case

Hình 1: Use case tổng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 22 | Trang

-- 24 of 124 --

STT Mã UC 	Tên UC 	Tác nhân 	Mô tả

### 1 	UC-1 Bán hàng Admin

Nhân viên
Người dùng có thể xem các
thông tin, trạng thái sản phẩm,
hóa đơn, giỏ hàng, đơn hàng,
thông tin hóa đơn. Có thể chọn
thông tin khách hàng đã có,
hoặc thêm thông tin khách hàng
mới, xóa, tạo hóa đơn, cập nhật
trạng thái đơn hàng. Ngoài ra
người dùng có thể tìm kiếm sản
phẩm, hóa đơn, xuất hóa đơn.

### 2 	UC-2 	Quản lý hóa đơn Admin

Nhân viên
Gồm chức năng cơ bản như:
Tìm kiếm, Cập nhật và Xóa.
Ngoài ra, người dùng có thể
xem chi tiết đơn hàng, có chức
năng xuất ra excel và pdf

### 3 	UC-3 	Quản lý sản phẩm 	Admin

Admin có thể: Tạo, tìm kiếm,
cập nhật, xóa thông tin sản
phẩm. Ngoài ra còn có thể quét
qr và tạo mã qr cho sản phẩm.

### 4 	UC-4 	Quản lý voucher 	Admin

Admin có thể: Tạo, tìm kiếm,
cập nhật, xóa, lọc thông tin các
phiếu giảm giá

### 4 	UC-5 	Quản lý khách hàng Admin

Nhân viên
Người dùng phần mềm có thể
thêm thông tin khách hàng cũng
như cập nhật, xóa thông tin
khách hàng cũng như xem lịch
sử hóa đơn khách hàng đã mua.

### 5 	UC-6 	Quản lý nhân viên 	Admin

Admin cần có khả năng xem có
bao nhiêu nhân viên trong cửa
hàng, bao gồm thông tin về các
nhân viên, để tìm kiếm một
nhân viên cụ thể và xem trạng
thái của nhân viên, và để cập
nhật, xóa một số nhân viên, nếu
cần thiết có thể thêm nhân viên,
có thể quét mã QR thông tin
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 23 | Trang

-- 25 of 124 --

nhân viên.

### 6 	UC-7 	Thống kê doanh thu 	Admin

Admin có thể xem doanh thu
của cửa hàng theo tháng, năm
hay khoảng thời gian bất kì
Bảng 9: Các use case
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 24 | Trang

-- 26 of 124 --

2.2.3 Đặc tả Use Case

### 2.2.3.1 	Bán hàng

Hình 2: Use case Bán Hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 25 | Trang

-- 27 of 124 --

Mã UC 	UC-1.1 	Tên Use Case 	Bán hàng tại quầy
Độ ưu tiên 	Cao 	Tác nhân 	Nhân viên/ Admin
User Story
liên quan
UC-1 	Người
phụ trách
Trần Công Lực
Mô tả 	Cho phép người dùng có thể bán hàng và tạo hóa đơn
Luồng chạy B1 Người dùng ở “Trang chủ”.
B2 Chọn “Bán hàng”.
B3 Người dùng chọn “Tạo đơn hàng”.
B4 Người dùng chọn sản phẩm để thêm vào giỏ hàng.
B5 Người dùng xác nhận địa chỉ nhận hàng.
B6 Người dùng xác nhận thông tin khách hàng và hình thức mua(gồm địa
chỉ nhận hàng và hình thức thanh toán) .
B7 Xác nhận đơn hàng.
Lưu ý
Bảng 10: UC-1.1 Bán hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 26 | Trang

-- 28 of 124 --

Hình 3: Activity Diagram bán hàng(1)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 27 | Trang

-- 29 of 124 --

Mã UC UC-1.2 	Tên Use Case 	Bán hàng online
Độ ưu tiên 	Cao 	Tác nhân 	Nhân viên/ Admin
User Story liên
quan
UC-1 	Người
phụ trách
Trần Công Lực
Mô tả 	Cho phép người dùng có thể bán hàng và tạo hóa đơn
Luồng chạy B1 Người dùng ở “Trang chủ”.
B2 Chọn “Bán hàng”
B3 Người dùng chọn “Tạo đơn hàng”.
B4 Người dùng chọn sản phẩm để thêm vào giỏ hàng.
B5 Người dùng xác nhận địa chỉ nhận hàng.
B6 Người dùng xác nhận thông tin khách hàng và hình thức thanh
toán.
B6 Xác nhận đơn đặt hàng.
Lưu ý 	Nếu sản phẩm đã hết sẽ không thể thêm vào giỏ hàng.
Bảng 11: UC-1.2 Bán hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 28 | Trang

-- 30 of 124 --

Hình 4: Activity Diagram bán hàng(2)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 29 | Trang

-- 31 of 124 --

Mã UC UC-1.3 	Tên Use Case 	Tìm kiếm sản phẩm
Độ ưu tiên 	Cao 	Tác nhân 	Nhân viên/ Admin
User Story liên
quan
UC-1 	Người
phụ trách
Trần Công Lực
Mô tả 	Cho phép người dùng có thể tìm kiếm sản phẩm
Luồng chạy B1 Người dùng ở “Trang chủ”.
B2 Chọn “Bán hàng”
B3 Người dùng nhập mã sản phẩm, tên sản phẩm vào ô tìm kiếm.
B4 Hệ thống sẽ hiện thông tin sản phẩm lên danh sách sản phẩm.
Lưu ý 	Nếu nhập sai thì hệ thống không hiện sản phẩm nào lên.
Bảng 12: UC-1.3 Bán hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 30 | Trang

-- 32 of 124 --

Hình 5: Activity Diagram bán hàng(3)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 31 | Trang

-- 33 of 124 --

Mã UC UC-1.4 	Tên Use Case 	Thêm vào giỏ hàng
Độ ưu tiên 	Cao 	Tác nhân 	Nhân viên/ Admin
User Story liên quan UC-1 	Người
phụ trách
Trần Công Lực
Mô tả 	Cho phép người dùng có thể bán hàng và tạo hóa đơn
Luồng chạy B1 Người dùng ở “Trang chủ”.
B2 Chọn “Bán hàng”
B3 Người dùng chọn “Tạo đơn hàng”.
B4 Người dùng chọn sản phẩm để thêm vào giỏ hàng.
Lưu ý 	Nếu sản phẩm đã hết sẽ không thể thêm vào giỏ hàng.
Bảng 13: UC-1.4 Bán hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 32 | Trang

-- 34 of 124 --

Hình 6: Activity Diagram bán hàng(4)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 33 | Trang

-- 35 of 124 --

Mã UC UC-1.5 Tên Use Case 	Xóa sản phẩm khỏi giỏ hàng
Độ ưu tiên Cao 	Tác nhân 	Nhân viên/ Admin
User Story liên
quan
UC-1 	Người
phụ trách
Trần Công Lực
Mô tả 	Cho phép người dùng có thể xóa sản phẩm khỏi giỏ hàng.
Luồng chạy B1 Người dùng ở “Trang chủ”.
B2 Chọn “Bán hàng”
B3 Người dùng chọn sản phẩm để xóa vào giỏ hàng.
B4 Chọn xóa.
B5 Hệ thống sẽ báo thành công và cập nhật lại giỏ hàng.
Lưu ý
Bảng 14: UC-1.5 Bán hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 34 | Trang

-- 36 of 124 --

Hình 7: Activity Diagram bán hàng(5)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 35 | Trang

-- 37 of 124 --

### 2.2.3.2 	Quản lý hóa đơn

Hình 8: Use case quản lý hóa đơn
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 36 | Trang

-- 38 of 124 --

Mã UC 	UC-2.1 	Tên Use Case 	Tìm hóa đơn
Độ ưu tiên 	Cao 	Tác nhân 	Nhân viên/ Admin
User Story
liên quan
US-2 	Người
phụ trách
Nguyễn Huy Tấn
Mô tả Người dùng có thể tìm và xem đơn hàng
Luồng chạy B1. Người dùng ở “Trang Chủ”.
B2. Người dùng chọn “Hóa đơn”.
B3. Người dùng nhập mã hóa đơn ở thanh tìm kiếm.
B4. Hệ thống sẽ hiện ra thông tin hóa đơn cần tìm.
Lưu ý Nếu mã sản phẩm không đúng, hoặc không có thì danh sách sẽ không
có thông tin hóa đơn nào được hiện lên.
Bảng 15: UC-2.1 Quản lý hóa đơn
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 37 | Trang

-- 39 of 124 --

Hình 9 : Activity Diagram quản lý hóa đơn(1)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 38 | Trang

-- 40 of 124 --

Mã UC 	UC-2.2 	Tên Use Case 	Cập nhật hóa đơn
Độ ưu tiên 	Cao 	Tác nhân 	Nhân viên/Admin
User Story
liên quan
US-2 	Người
phụ trách
Nguyễn Huy Tấn
Mô tả Cho phép sửa thông tin đơn hàng
Luồng chạy B1. Người dùng ở “Trang Chủ”.
B2. Người dùng chọn “Hóa đơn”.
B3. Người dùng chọn hóa đơn cần sửa.
B4. Chọn sửa hóa đơn
B5. Nhập thông tin hóa đơn cần sửa theo form.
B6. Chọn “Yes”
B7. Hệ thống sẽ hiện thông báo về việc cập nhật thành công và cập
nhật lên danh sách hóa đơn
Lưu ý Nếu thông tin nhập không hợp lệ hoặc bị thiếu, hệ thống sẽ hiển thị
thông báo lỗi và yêu cầu điền lại thông tin cần thiết.
Bảng 16: UC-2.2 Quản lý hóa đơn
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 39 | Trang

-- 41 of 124 --

Hình 10: Activity Diagram quản lý hóa đơn(2)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 40 | Trang

-- 42 of 124 --

Mã UC 	UC-2.3 	Tên Use Case 	Xóa hóa đơn
Độ ưu tiên 	Trung bình 	Tác nhân 	Nhân viên/ Admin
User Story
liên quan
UC-2 	Người
phụ trách
Nguyễn Huy Tấn
Mô tả Cho phép xóa hóa đơn
Luồng chạy B1. Người dùng ở “Trang Chủ”.
B2. Người dùng chọn “Hóa đơn”.
B3. Người dùng chọn hóa đơn cần xóa.
B4. Chọn xóa hóa đơn
B5. Chọn “Yes”
B6. Hệ thống sẽ hiện thông báo về việc xóa thành công và cập nhật
lên danh sách hóa đơn.
Lưu ý Nếu không chọn sản phẩm muốn xóa hệ thống sẽ thông báo lỗi và
hiện lại trang bạn thông tin sản phẩm.
Bảng 17: UC-2,3 Quản lý hóa đơn
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 41 | Trang

-- 43 of 124 --

Hình 11: Activity Diagram quản lý hóa đơn(3)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 42 | Trang

-- 44 of 124 --

Mã UC UC-2.4 	Tên Use Case 	Xuất hóa đơn ra file pdf
Độ ưu tiên 	Cao 	Tác nhân 	Quản trị viên/Kỹ thuật viên
User Story
liên quan
US-2 	Người
phụ trách
Nguyễn Huy Tấn
Mô tả Cho phép người dùng xuất hóa đơn ra file pdf
Luồng chạy B1. Người dùng ở “Trang Chủ”.
B2. Người dùng chọn “Hóa đơn”.
B3. Người dùng chọn hóa đơn cần xuất ra file pdf.
B4. Chọn in hóa đơn.
B5. Chọn “Yes”.
B6. Hệ thống sẽ hiện thông báo về việc in hóa đơn thành công và
xuất ra file pdf hóa đơn.
Lưu ý Nếu không chọn sản phẩm muốn in hệ thống sẽ thông báo lỗi và hiện
lại trang bạn thông tin sản phẩm.
Bảng 18: UC-2.4 Quản lý hóa đơn
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 43 | Trang

-- 45 of 124 --

Hình 12: Activity Diagram quản lý hóa đơn(4)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 44 | Trang

-- 46 of 124 --

Mã UC UC-2.5 	Tên Use Case 	Xuất hóa đơn ra file excel
Độ ưu tiên 	Cao 	Tác nhân 	Quản trị viên/Kỹ thuật viên
User Story liên
quan
US-2 	Người
phụ trách
Nguyễn Huy Tấn
Mô tả Cho phép người dùng xuất hóa đơn ra file excel
Luồng chạy B1. Người dùng ở “Trang Chủ”.
B2. Người dùng chọn quản lý sản phẩm.
B3. Chọn xuất hóa đơn.
B4. Chọn “Yes”.
B5. Hệ thống sẽ hiện thông báo về việc in hóa đơn thành công và
xuất ra file excel hóa đơn.
Lưu ý
Bảng 19: UC 2.5 Quản lý hóa đơn
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 45 | Trang

-- 47 of 124 --

Hình 13: Activity Diagram quản lý hóa đơn(5)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 46 | Trang

-- 48 of 124 --

### 2.2.3.3 	Quản lý sản phẩm

Hình 14: Use case quản lý nhân viên
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 47 | Trang

-- 49 of 124 --

Mã Use Case 	UC-3.1 	Tên Use Case 	Thêm sản phẩm
Độ ưu tiên 	Cao 	Tác nhân 	Admin
User Story
liên quan
US-3 	Người
phụ trách
Trần Công Lực
Mô tả Cho phép thêm sản phẩm.
Luồng chạy B1. Người dùng ở “Trang chủ”
B2. Chọn “Sản phẩm”.
B3. Nhập thông tin sản phẩm muốn thêm theo form.
B4. Chọn “Thêm sản phẩm” .
B5. Hệ thống sẽ hiện thông báo “Thêm thành công” và hiện lên danh
sách sản phẩm.
Lưu ý Nếu thông tin nhập không hợp lệ hoặc bị thiếu, hệ thống sẽ hiển thị
thông báo lỗi và yêu cầu điền lại thông tin cần thiết.
Bảng 20: UC-3.1 Quản lý sản phẩm
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 48 | Trang

-- 50 of 124 --

Hình 15: Activity Diagram quản lý sản phẩm(1)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 49 | Trang

-- 51 of 124 --

Mã UC 	UC-3.2 	Tên Use Case 	Sửa sản phẩm
Độ ưu tiên 	Cao 	Tác nhân 	Admin
User Story
liên quan
US-3 	Người
phụ trách
Trần Công Lực
Mô tả Cho phép sửa thông tin sản phẩm, xóa thông tin sản phẩm.
Luồng chạy B1. Người dùng ở “Trang chủ”
B2. Chọn “sản phẩm”
B3. Ở màn hình phẩm chọn sửa sản phẩm.
B4. Nhập thông tin sản phẩm muốn sửa theo form.
B5. Chọn “Yes” .
B6. Hệ thống sẽ hiện thông báo về việc sửa thành công và cập nhật lên
danh sách sản phẩm.
Lưu ý Nếu thông tin nhập không hợp lệ hoặc bị thiếu, hệ thống sẽ hiển thị
thông báo lỗi và yêu cầu điền lại thông tin cần thiết.
Bảng 21: UC-3.2 Quản lý sản phẩm
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 50 | Trang

-- 52 of 124 --

Hình 16: Activity Diagram quản lý sản phẩm(2)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 51 | Trang

-- 53 of 124 --

Mã UC 	UC-3.3 	Tên Use Case 	Xóa sản phẩm
Độ ưu tiên 	Trung bình 	Tác nhân 	Quản trị viên
User Story
liên quan
UC-3 	Người
phụ trách
Trần Công Lực
Mô tả Cho phép xóa thông tin sản phẩm.
Luồng chạy B1. Admin ở “Trang chủ”
B2. Chọn “Sản phẩm”
B3. Ở màn hình sản phẩm chọn xóa sản phẩm.
B4. Chọn “Yes” .
B5. Hệ thống sẽ hiện thông báo về việc xóa thành công và cập nhật
lên danh sách sản phẩm.
Lưu ý Nếu không chọn sản phẩm muốn xóa hệ thống sẽ thông báo lỗi và
hiện lại trang bạn thông tin sản phẩm.
Bảng 22: UC-3.3 Quản lý sản phẩm
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 52 | Trang

-- 54 of 124 --

Hình 17: Activity Diagram quản lý sản phẩm(3)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 53 | Trang

-- 55 of 124 --

Mã UC 	UC-3.4 	Tên Use Case 	Tìm kiếm sản phẩm
Độ ưu tiên 	Cao 	Tác nhân 	Admin
User Story liên
quan
UC-3 	Người
phụ trách
Trần Công Lực
Mô tả Cho phép xóa thông tin sản phẩm.
Luồng chạy B1. Admin ở “Trang chủ”
B2. Chọn “Sản phẩm”
B3. Ở màn hình sản phẩm nhập mã tên sản phẩm muốn tìm vào ô tìm
kiếm.
B4. Hệ thống sẽ hiện danh sách sản phẩm cần tìm
Lưu ý Nếu không nhập đúng hoặc không có sản phẩm danh sách sẽ không
có sản phẩm nào được hiện lên
Bảng 23: UC-3.4 Quản lý sản phẩm
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 54 | Trang

-- 56 of 124 --

Hình 18: Activity Diagram quản lý sản phẩm(4)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 55 | Trang

-- 57 of 124 --

### 2.2.3.4 	Quản lý voucher

Hình 19: Use case quản lý voucher
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 56 | Trang

-- 58 of 124 --

Mã UC 	UC-4.1 	Tên Use Case 	Thêm voucher
Độ ưu tiên Cao Tác nhân Admin
User Story liên
quan
UC-4 Người
phụ trách
Trần Công Lực
Mô tả Cho phép người dùng tạo các phiếu giảm giá
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Voucher”.
B3. Ở màn hình voucher chọn thêm.
B4. Nhập thông tin voucher muốn thêm theo form.
B5. Chọn thêm.
B6. Chọn “Yes” .
B7. Hệ thống sẽ hiện thông báo “Thêm thành công” và hiện lên danh
sách voucher.
Lưu ý Nếu để trống hay nhập không đúng thì hệ thống sẽ báo lỗi và yêu
cầu nhập lại
Bảng 24: UC-4.1 Quản lý voucher
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 57 | Trang

-- 59 of 124 --

Hình 20: Activity Diagram quản lý voucher(1)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 58 | Trang

-- 60 of 124 --

Mã UC 	UC-4.2 	Tên Use Case 	Sửa thông tin voucher
Độ ưu tiên Cao Tác nhân Admin
User Story liên
quan
UC-4 Người
phụ trách
Trần Công Lực
Mô tả Cho phép người dùng sửa thông tin phiếu giảm giá
Luồng chạy
B1. Người dùng ở “Trang chủ” .
B2. Chọn “Voucher”.
B3. Ở màn hình voucher chọn voucher muốn sửa.
B4. Nhập thông tin voucher muốn sửa theo form.
B5. Chọn “Sửa”.
B6. Chọn “Yes” .
B7. Hệ thống sẽ hiện thông báo “Sửa thành công” và cập nhật lên
danh sách Voucher.
Lưu ý Nếu để trống hay nhập không đúng thì hệ thống sẽ báo lỗi và yêu
cầu nhập lại
Bảng 25: UC-4.2 Quản lý voucher
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 59 | Trang

-- 61 of 124 --

Hình 21: Activity Diagram quản lý voucher(2)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 60 | Trang

-- 62 of 124 --

Mã UC 	UC-4.3 	Tên Use Case 	Xóa voucher
Độ ưu tiên Cao Tác nhân Admin
User Story liên
quan
UC-4 Người
phụ trách
Trần Công Lực
Mô tả Cho phép người dùng xóa phiếu giảm giá
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Voucher”.
B3. Ở màn hình voucher chọn voucher muốn xóa.
B4. Chọn “Yes” .
B5. Hệ thống sẽ hiện thông báo “Xóa thành công” và cập nhật lên
danh sách sản phẩm.
Lưu ý
Bảng 26: UC-4.3 Quản lý voucher
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 61 | Trang

-- 63 of 124 --

Hình 22: Activity Diagram quản lý voucher(3)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 62 | Trang

-- 64 of 124 --

Mã UC 	UC-4.4 	Tên Use Case 	Tìm kiếm voucher
Độ ưu tiên Cao Tác nhân Admin
User Story liên
quan
UC-4 Người
phụ trách
Trần Công Lực
Mô tả Cho phép người dùng tìm kiếm phiếu giảm giá
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Voucher”.
B3. Ở màn hình voucher nhập mã, tên voucher muốn tìm.
B4. Hệ thống sẽ hiện thông tin các voucher muốn tìm.
Lưu ý Nếu không có mã, tên voucher khớp thì hệ thống sẽ không hiện
voucher nào lên danh sách.
Bảng 27: UC-4.4 Quản lý voucher
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 63 | Trang

-- 65 of 124 --

Hình 23: Hình 20: Activity Diagram quản lý voucher(4)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 64 | Trang

-- 66 of 124 --

Mã UC 	UC-4.5 	Tên Use Case 	Lọc voucher
Độ ưu tiên Cao Tác nhân Admin
User Story liên
quan
UC-4 Người
phụ trách
Trần Công Lực
Mô tả Cho phép người dùng lọc phiếu giảm giá
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Voucher”.
B3. Ở màn hình voucher chọn khoảng thời gian muốn lọc voucher.
B4. Hệ thống sẽ hiện các voucher muốn tìm.
Lưu ý Nếu không có voucher khớp thì hệ thống sẽ không hiện voucher nào
lên danh sách.
Bảng 28: UC-4.5 Quản lý voucher(4)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 65 | Trang

-- 67 of 124 --

Hình 24: Activity Diagram quản lý voucher(5)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 66 | Trang

-- 68 of 124 --

### 2.2.3.5 	Quản lý khách hàng

Hình 25: Use case quản lý khách hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 67 | Trang

-- 69 of 124 --

Mã UC 	UC-5.1 	Tên Use Case Thêm thông tin khách hàng
Độ ưu tiên Cao Tác nhân Nhân viên/Admin
User Story liên
quan
UC-5 Người
phụ trách
Nguyễn Tuấn Thuật
Mô tả Cho phép người dùng thêm thông tin khách hàng
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Khách hàng”.
B3. Ở màn hình khách hàng chọn “thêm”.
B4. Nhập thông tin khách hàng muốn thêm theo form.
B5. Chọn thêm.
B6. Chọn “Yes” .
B7. Hệ thống sẽ hiện thông báo “Thêm thành công” và hiện lên danh
sách khách hàng.
Lưu ý Nếu để trống hay nhập không đúng thì hệ thống sẽ báo lỗi và yêu
cầu nhập lại
Bảng 29: UC-5.1 Quản lý khách hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 68 | Trang

-- 70 of 124 --

Hình 26: Activity Diagram quản lý khách hàng(1)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 69 | Trang

-- 71 of 124 --

Mã UC 	UC-5.2 	Tên Use Case 	Sửa thông tin khách hàng
Độ ưu tiên Cao Tác nhân Nhân viên/Admin
User Story liên
quan
UC-5 Người
phụ trách
Nguyễn Tuấn Thuật
Mô tả Cho phép người dùng sửa thông tin khách hàng
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Khách hàng”.
B3. Ở màn hình khách hàng chọn thông tin khách hàng muốn sửa.
B4. Nhập thông tin khách hàng muốn sửa theo form.
B5. Chọn sửa.
B6. Chọn “Yes” .
B6. Hệ thống sẽ hiện thông báo “Sửa thành công” và cập nhật lên
danh sách khách hàng.
Lưu ý Nếu để trống hay nhập không đúng thì hệ thống sẽ báo lỗi và yêu cầu
nhập lại
Bảng 30: UC-5.2 Quản lý khách hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 70 | Trang

-- 72 of 124 --

Hình 27: Activity Diagram quản lý khách hàng(2)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 71 | Trang

-- 73 of 124 --

Mã UC 	UC-5.3 	Tên Use Case Xóa thông tin khách hàng
Độ ưu tiên Cao Tác nhân Nhân viên/Admin
User Story liên
quan
UC-5 Người
phụ trách
Nguyễn Tuấn Thuật
Mô tả Cho phép người dùng xóa thông tin khách hàng
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Khách hàng”.
B3. Ở màn hình khách hàng chọn thông tin khách hàng muốn xóa.
B4. Chọn xóa.
B5. Chọn “Yes” .
B6. Hệ thống sẽ hiện thông báo “Xóa thành công”.
Lưu ý
Bảng 31: UC-5.3 Quản lý khách hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 72 | Trang

-- 74 of 124 --

Hình 28: Activity Diagram quản lý khách hàng(3)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 73 | Trang

-- 75 of 124 --

Mã UC 	UC-5.4 	Tên Use Case 	Tìm kiếm khách hàng
Độ ưu tiên 	Cao 	Tác nhân 	Nhân viên /Admin
User Story liên
quan UC-5
Người
phụ trách
Trần Công Lực
Mô tả Cho phép tìm kiếm thông tin khách hàng
Luồng chạy
B1. Admin ở “Trang chủ”.
B2. Chọn “Khách hàng”.
B3. Ở màn hình sản phẩm nhập mã khách hàng muốn tìm vào ô tìm
kiếm.
B4. Hệ thống sẽ hiện danh sách khách hàng cần tìm.
Lưu ý Nếu không nhập đúng hoặc không có khách hàng danh sách sẽ
không có thông tin khách hàng nào được hiện lên.
Bảng 32: UC 5.4 Quản lý khách hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 74 | Trang

-- 76 of 124 --

Hình 29: Activity Diagram quản lý sản phẩm(4)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 75 | Trang

-- 77 of 124 --

### 2.2.3.6 Quản lý nhân viên

Hình 30: Use case quản lý nhân viên
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 76 | Trang

-- 78 of 124 --

Mã UC 	UC-6.1 	Tên Use Case 	Thêm nhân viên
Độ ưu tiên 	Cao 	Tác nhân 	Admin
User Story
liên quan UC-6
Người
phụ trách
Nguyễn Văn Minh
Mô tả Cho phép người dùng thêm thông tin nhân viên
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Nhân viên”.
B3. Ở màn hình nhân viên chọn thêm nhân viên.
B4. Nhập thông tin nhân viên muốn thêm theo form.
B5.Chọn thêm thông tin.
B6. Chọn “Yes” .
B7. Hệ thống sẽ hiện thông báo “Thêm thành công” và hiện lên danh
sách nhân viên.
Lưu ý Nếu nhập thiếu hoặc không đúng hệ thống sẽ hiện lại thông báo lỗi
yêu cầu nhập lại đầy đủ vào form.
Bảng 33: UC-6.1 Quản lý nhân viên
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 77 | Trang

-- 79 of 124 --

Hình 31: Activity Diagram quản lý nhân viên(1)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 78 | Trang

-- 80 of 124 --

Mã UC UC-6.2 	Tên Use Case 	Sửa thông tin nhân viên
Độ ưu tiên 	Cao 	Tác nhân 	Admin
User Story
liên quan UC-6
Người
phụ trách
Nguyễn Văn Minh
Mô tả Cho phép người dùng thay đổi thông tin nhân viên
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Nhân viên”.
B3. Ở màn hình nhân viên chọn nhân viên cần sửa.
B4. Nhập thông tin nhân viên muốn sửa theo form.
B5.Chọn sửa thông tin.
B6. Chọn “Yes” .
B7. Hệ thống sẽ hiện thông báo “Sửa thành công” và cập nhật lên
danh sách nhân viên.
Lưu ý Nếu nhập thiếu hoặc không đúng hệ thống sẽ hiện lại thông báo lỗi
yêu cầu nhập lại đầy đủ vào form.
Bảng 34: UC-6.2 Quản lý nhân viên
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 79 | Trang

-- 81 of 124 --

Hình 32: Activity Diagram quản lý nhân viên(2)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 80 | Trang

-- 82 of 124 --

Mã UC UC-6.3 	Tên Use Case 	Xóa thông tin nhân viên
Độ ưu tiên 	Cao 	Tác nhân 	Admin
User Story liên
quan UC-6
Người
phụ trách
Nguyễn Văn Minh
Mô tả Cho phép người dùng xóa thông tin nhân viên
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Nhân viên”.
B3. Ở màn hình nhân viên chọn nhân viên muốn xóa.
B5. Chọn “Yes” .
B6. Hệ thống sẽ hiện thông báo “Xóa thành công” và cập nhật lên
danh sách nhân viên.
Lưu ý Nếu không chọn nhân viên nào hệ thống sẽ báo lỗi và hiện lại trang
nhân viên
Bảng 35: UC-6.3 Quản lý nhân viên
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 81 | Trang

-- 83 of 124 --

Hình 33: Activity Diagram quản lý nhân viên(3)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 82 | Trang

-- 84 of 124 --

Mã UC UC-6.4 	Tên Use Case 	Tìm kiếm thông tin nhân viên
Độ ưu tiên 	Thấp 	Tác nhân 	Quản trị viên/Kỹ thuật viên
User Story liên
quan UC-6
Người
phụ trách
Nguyễn Văn Minh
Mô tả Cho phép người dùng tìm kiếm thông tin nhân viên
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Nhân viên”.
B3. Ở màn hình nhân viên nhập mã, tên nhân viên muốn tìm .
B4. Chọn tìm kiếm.
B6. Thông tin nhân viên sẽ hiện lên danh sách.
Lưu ý Nếu không nhập hay nhập không đúng sẽ không có thông tin nào
hiện lên danh sách.
Bảng 36: UC-6.4 Quản lý nhân viên
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 83 | Trang

-- 85 of 124 --

Hình 34: Activity Diagram quản lý nhân viên(4)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 84 | Trang

-- 86 of 124 --

### 2.2.3.7 	Thống kê doanh thu

Hình 35: Use case Thống kê doanh thu
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 85 | Trang

-- 87 of 124 --

Mã UC UC-7.1 	Tên Use Case Thống kê doanh thu
Độ ưu tiên Cao Tác nhân Admin
User Story liên quan UC-7 Người
phụ trách
Nguyễn Văn Minh
Mô tả Cho phép người dùng tìm và xem doanh thu
Luồng chạy
B1. Người dùng ở “Trang chủ”
B2. Chọn “Thống kê”.
B3. Ở màn hình doanh thu chọn khoảng thời gian muốn xem.
B4. Hệ thống sẽ hiện lên doanh thu theo khoảng thời gian.
Lưu ý
Bảng 37: UC-7.1 Thống kê doanh thu
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 86 | Trang

-- 88 of 124 --

Hình 36: Activity Diagram thống kê doanh thu
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 87 | Trang

-- 89 of 124 --

### 2.3 Quan hệ thực thể

### 2.3.1 Danh sách thực thể

STT 	Tên thực thể 	Mô tả

### 1 Khách hàng Là người mua hàng tại quầy hoặc gọi điện đến cửa

hàng đặt hàng.
2
Nhân viên Là người dùng đăng nhập vào hệ thống có vai trò
“Nhân viên” hoặc “Admin”.

### 3 Hoá đơn Là chứng từ do nhân viên lập khi khách hàng mua hàng

có thông tin hàng hóa,...
4
Tài khoản Là thông tin xác thực khi người dùng đăng nhập vào hệ
thống
Bảng 38: Danh sách thực thể
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 88 | Trang

-- 90 of 124 --

### 2.3.2 Các mối quan hệ

Ký hiệu 	Giải thích
Nhiều
Một: Đơn thuần là một
Bảng 39: Các mối quan hệ
Công việc của nhân viên trên một hệ thống bán hàng trực tuyến và trực tiếp có thể bao gồm các
nhiệm vụ sau:
- Tiếp nhận hóa đơn: Nhân viên phải tiếp nhận các đơn hàng từ khách hàng thông qua hệ
thống. Điều này bao gồm kiểm tra thông tin đơn hàng, xác nhận tính khả dụng của sản
phẩm, và đảm bảo các chi tiết đơn hàng đầy đủ và chính xác.
- Tạo hóa đơn: Nhân viên phải tạo hóa đơn sau khi giao dịch.
- Xử lý hóa đơn: Nhân viên phải xử lý các hóa đơn đã được tiếp nhận. Điều này bao gồm việc
xác nhận hóa đơn, kiểm tra số lượng và tính khả dụng của sản phẩm.
- Xác nhận thanh toán: Nhân viên phải xử lý các thanh toán từ khách hàng. Điều này bao gồm
kiểm tra và xác nhận thông tin thanh toán, ghi nhận số tiền đã thanh toán.
Hình 37: Mối quan hệ nhân viên-hóa đơn
- Hỗ trợ khách hàng: Nhân viên cần hỗ trợ khách hàng trong quá trình mua hàng và sau khi
giao dịch.
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 89 | Trang

-- 91 of 124 --

Hình 38: Mối quan hệ nhân viên-khách hàng
Mỗi nhân viên có một tài khoản hệ thống:
- Mỗi nhân viên sẽ có một tài khoản hệ thống để đăng nhập và truy cập vào hệ thống.
- Tài khoản này được sử dụng để xác thực và xác định quyền truy cập của nhân viên vào các
chức năng và thông tin trên hệ thống.
hình 39: Mối quan hệ tài khoản-nhân viên
- Tài khoản hệ thống xác định quyền truy cập của nhân viên: Tài khoản hệ thống được sử
dụng để xác định và quản lý quyền truy cập của nhân viên vào các chức năng, thông tin và
tài nguyên trên hệ thống. Quyền truy cập có thể được xác định dựa trên vai trò của nhân
viên, ví dụ như quyền truy cập vào thông tin khách hàng, quyền tạo, chỉnh sửa hoặc xóa sản
phẩm, quyền xem báo cáo, v.v.
- Tài khoản hệ thống quản lý các thông tin nhân viên: Tài khoản hệ thống cũng có thể được sử
dụng để lưu trữ và quản lý các thông tin về nhân viên như tên, địa chỉ, thông tin liên lạc,
chức vụ. Điều này giúp cho việc quản lý và tra cứu thông tin nhân viên dễ dàng và hiệu quả.
Một nhân viên quản lý có thể quản lý nhiều nhân viên khác.
- Nhân viên quản lý có trách nhiệm quản lý và hướng dẫn nhân viên: Nhân viên quản lý có
trách nhiệm quản lý và điều hành công việc của nhân viên trong nhóm hoặc bộ phận mà họ
đang quản lý. Họ phải đảm bảo rằng nhân viên được hướng dẫn, đào tạo và được cung cấp
sự hỗ trợ cần thiết để hoàn thành công việc.
Hình 40: Mối quan hệ quản lý-nhân viên
- Giao nhiệm vụ và phân công công việc: Nhân viên quản lý phải giao nhiệm vụ và phân công
công việc cho nhân viên dưới sự quản lý của mình. Họ cần phân chia công việc một cách
công bằng và hiệu quả, đảm bảo rằng mỗi nhân viên được đảm nhận công việc phù hợp với
năng lực và trách nhiệm của họ.
- Hỗ trợ và đào tạo nhân viên: Nhân viên quản lý có trách nhiệm cung cấp hỗ trợ và đào tạo
cho nhân viên dưới quyền của họ. Điều này có thể bao gồm việc cung cấp hướng dẫn, giải
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 90 | Trang

-- 92 of 124 --

đáp các câu hỏi, hỗ trợ về kỹ thuật và công nghệ, đào tạo nâng cao kỹ năng và khả năng làm
việc của nhân viên.
- Đánh giá và phản hồi: Nhân viên quản lý phải thực hiện việc đánh giá hiệu suất và cung cấp
phản hồi cho nhân viên dưới sự quản lý của mình. Điều này bao gồm việc đề ra mục tiêu,
đánh giá hiệu suất, đưa ra phản hồi xây dựng và đề xuất các biện pháp cải thiện.

### 2.3.3 Sơ đồ quan hệ thực thể

Hình 41: Sơ đồ quan hệ thực thể
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 91 | Trang

-- 93 of 124 --

## PHẦN 3: THIẾT KẾ

### 3.1 Kiến trúc hệ thống

Không bắt buộc
Context diagram? Ecosystem diagram?

### 3.2 Cơ sở dữ liệu

### 3.2.1 Chuẩn hóa

Không bắt buộc
Chỉ ra các mối quan hệ cần chuẩn hóa

### 3.2.2 Danh sách bảng

Hình 42: Danh sách bảng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 92 | Trang

-- 94 of 124 --

Hình 43: Database3
3
https://drive.google.com/file/d/1DArFcQcda6ySTAZbqXZQl5vmM9S9rdnw/view?usp=sharing
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 93 | Trang

-- 95 of 124 --

STT 	Tên bảng 	Mô tả 	Phụ thuộc

### 1 	KhachHang 	Chứa dữ liệu khách hàng 	-

### 2 	HoaDon 	Chứa dữ liệu hóa đơn 	KhachHang, NhanVien

### 3 	HoaDonChiTiet 	Chứa số lượng sản phẩm, số tiền, nhân

viên tạo đơn, thông tin hoá đơn
SanPhamChiTiet,
HoaDon

### 4 	SanPhamChiTiet 	Chứa thông tin sản phẩm, thuộc tính

sản phẩm, giá bán, trạng thái
Anh, SanPham,
ChatLieu, Size,
MauSac, Hang, DeGiay

### 5 	NhanVien 	Chứa thông tin nhân viên 	-

### 6 	VaiTro 	Chứa thông tin vai trò của nhân viên 	NhanVien

### 7 	Voucher 	Chứa dữ liệu về các chương trình

khuyến mãi
HoaDon, NhanVien

### 8 	KhachHang_Voucher Chứa thông tin số lượng voucher của

khách hàng
Voucher, KhachHang

### 9 	DiaChi 	Chứa địa chỉ cụ thể của khách hàng 	KhachHang

### 10 	Anh 	Chứa ảnh liên quan tới sản phẩm 	-

### 11 	SanPham 	Chứa các thông tin về sản phẩm 	-

### 12 	ChatLieu 	Chứa thông tin về chất liệu sản phẩm 	-

### 13 	Hang 	Chứa thông tin về hãng của sản phẩm 	-

### 14 	MauSac 	Chứa dữ liệu về màu sắc của sản phẩm 	-

### 15 	Size 	Chứa thông tin về kích cỡ của sản

phẩm
-

### 16 	DeGiay 	Chứa thông tin về đế giày của các sản

phẩm
-

### 17 	GiamGia_SPCT 	Chứa thông tin về voucher số tiền

giảm khi sử dụng voucher
Voucher,
KhachHang_Voucher
Bảng 40: Danh sách bảng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 94 | Trang

-- 96 of 124 --

3.2.3 Đặc tả bảng
Hình 44: Danh sách bảng(2)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 95 | Trang

-- 97 of 124 --

Bảng HoaDon
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID hóa đơn 	PK, ID11

### 2 	ID_KhachHang 	INT 	ID khách hàng 	FK, NULL

### 3 	ID_NhanVien 	INT 	ID nhân viên 	FK, NULL

### 4 	TenKH 	NVARCHAR(50) Tên khách hàng 	NULL

5 	sdt 	VARCHAR(50) Số điện thoại khách hàng 	NULL
6 	tongTien 	MONEY 	Tổng số tiền cần thanh toán 	NULL
7 	trangThai 	NVARCHAR(50) Trạng thái hóa đơn 	NULL
8 	diaChi 	NVARCHAR(50) Địa chỉ khách hàng 	NULL
9 	ngayShip 	DATETIME2(7) Ngày vận chuyển cho khách 	NULL
10 	ngayNhan 	DATETIME2(7) Ngày nhận hàng 	NULL
11 	ngayXacNhan 	DATETIME2(7) Ngày xác nhận 	NULL
12 	ngayMuonNhan 	DATETIME2(7) Ngày muốn nhận 	NULL
13 	soTienGiam 	MONEY 	Số tiền giảm 	NULL

### 14 	PhiShip 	MONEY 	Phí vận chuyển 	NULL

### 15 	HinhThucThanhToan 	NVARCHAR(50) Hình thức thanh toán hóa

đơn

## NULL

### 16 	TrangThaiThanhT 	NVARCHAR(50) trạng thái thanh toán của

hóa đơn

## NULL

17 	create_at 	DATETIME2(7) Ngày tạo 	NULL
18 	create_by 	VARCHAR(20) Người tạo 	NULL
19 	update_at 	DATETIME2(7) Ngày sửa 	NULL
20 	update_by 	VARCHAR(20) Người sửa 	NULL
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 96 | Trang

-- 98 of 124 --

21 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

### 22 	NgayGiaoDich 	DATETIME2(7) Ngày giao dịch 	NULL

### 23 	ID_Voucher 	INT 	ID Voucher 	FK, NULL

Bảng 41: Bảng HoaDon
Bảng HoaDonChiTiet
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID hóa đơn chi tiết 	PK, ID11

### 2 	ID_SanPhamChiTiet 	INT 	ID sản phẩm chi tiết 	FK, NULL

### 3 	ID_HoaDon 	INT 	ID Hóa đơn 	FK, NULL

4 	soLuong 	INT 	Số lượng sản phẩm 	NULL
5 	gia 	MONEY 	giá sản phẩm 	NULL
6 	ceate_at 	DATETIME2(7) 	Ngày tạo 	NULL
7 	create_by 	VARCHAR(20) 	Người tạo 	NULL
8 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
9 	update_by 	VARCHAR(20) 	Người sửa 	NULL
10 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

Bảng 42: Bảng HoaDonChiTiet
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 97 | Trang

-- 99 of 124 --

Bảng SanPhamChiTiet
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID Sản phẩm chi tiết 	PK, ID11

### 2 	ID_SanPham 	INT 	ID sản phẩm 	FK, NULL

### 3 	ID_MauSac 	INT 	ID màu sắc 	FK, NULL

### 4 	ID_Size 	INT 	ID size 	FK, NULL

### 5 	ID_Hang 	INT 	ID hãng 	FK, NULL

### 4 	ID_ChatLieu 	INT 	ID chất liệu 	FK, NULL

### 5 	ID_DeGiay 	INT 	ID đế giày 	FK, NULL

### 6 	MoTa 	NVARCHAR(50) 	Mô tả sản phẩm 	NULL

### 7 	Gia 	MONEY 	Giá sản phẩm 	NULL

### 8 	SoLuongTon 	INT 	Số lượng sản phẩm còn lại 	NULL

### 9 	TrangThai 	NVARCHAR(50) 	Trạng thái sản phẩm 	NULL

10 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
11 	create_by 	VARCHAR(20) 	Người tạo 	NULL
12 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
13 	update_by 	VARCHAR(20) 	người sửa 	NULL
14 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

### 15 	MaSPCT 	VARCHAR(255) 	Mã sản phẩm chi tiết 	NULL

Bảng 43: Bảng SanPhamChiTiet
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 98 | Trang

-- 100 of 124 --

Hình 45: Danh sách bảng (3)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 99 | Trang

-- 101 of 124 --

Bảng SanPham
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID sản phẩm 	PK, ID11

### 2 	Ten 	NVARCHAR(50) 	Tên sản phẩm 	NULL

### 3 	TrangThai 	NVARCHAR(50) 	trạng thái sản phẩm 	NULL

4 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
5 	create_by 	VARCHAR(50) 	Người tạo 	NULL
6 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
7 	update_by 	VARCHAR(50) 	Người sửa 	NULL
8 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

Bảng 44: Bảng SanPham
Bảng 45: Bảng DeGiay
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 100 | Trang
Bảng DeGiay
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID đế giày 	PK, ID11

### 2 	TenDeGiay 	NVARCHAR(50) 	Tên đế giày 	NULL

### 3 	TrangThai 	NVARCHAR(50) 	trạng thái đế giày 	NULL

4 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
5 	create_by 	VARCHAR(50) 	Người tạo 	NULL
6 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
7 	update_by 	VARCHAR(50) 	Người sửa 	NULL
8 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

-- 102 of 124 --

Bảng Hang
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID hãng 	PK, ID11

### 2 	Ten 	NVARCHAR(50) 	Tên hãng 	NULL

### 3 	TrangThai 	NVARCHAR(50) 	trạng thái hãng 	NULL

4 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
5 	create_by 	VARCHAR(50) 	Người tạo 	NULL
6 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
7 	update_by 	VARCHAR(50) 	Người sửa 	NULL
8 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

Bảng 46: Bảng Hang
Bảng 47: Bảng Size
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 101 | Trang
Bảng Size
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID size 	PK, ID11

### 2 	Size 	NVARCHAR(50) 	Kích cỡ giày 	NULL

### 3 	TrangThai 	NVARCHAR(50) 	trạng thái size 	NULL

4 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
5 	create_by 	VARCHAR(50) 	Người tạo 	NULL
6 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
7 	update_by 	VARCHAR(50) 	Người sửa 	NULL
8 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

-- 103 of 124 --

Bảng Mau
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID màu 	PK, ID11

### 2 	TenMau 	NVARCHAR(50) 	Tên màu 	NULL

### 3 	MaMau 	VARCHAR(50) 	Mã màu 	NULL

### 4 	TrangThai 	NVARCHAR(50) 	trạng thái màu 	NULL

5 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
6 	create_by 	VARCHAR(50) 	Người tạo 	NULL
7 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
8 	update_by 	VARCHAR(50) 	Người sửa 	NULL
9 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

Bảng 48: Bảng Mau
Bảng ChatLieu
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID chất liệu 	PK, ID11

### 2 	Ten 	NVARCHAR(50) 	Tên chất liệu 	NULL

### 3 	TrangThai 	NVARCHAR(50) 	trạng thái chất liệu 	NULL

4 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
5 	create_by 	VARCHAR(50) 	Người tạo 	NULL
6 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
7 	update_by 	VARCHAR(50) 	Người sửa 	NULL
8 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

Bảng 49: Bảng ChatLieu
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 102 | Trang

-- 104 of 124 --

Bảng Anh
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID ảnh 	PK, ID11

### 2 	TenAnh 	VARCHAR(50) Tên ảnh 	NULL

### 3 	ID_SanPhamrChiTiet 	INT 	ID sản phẩm chi tiết 	FK, NULL

### 4 	TrangThai 	NVARCHAR(50) trạng thái sản phẩm 	NULL

5 	create_at 	DATETIME2(7) Ngày tạo 	NULL
6 	create_by 	VARCHAR(50) Người tạo 	NULL
7 	update_at 	DATETIME2(7) Ngày sửa 	NULL
8 	update_by 	VARCHAR(50) Người sửa 	NULL
9 	deleted 	BIT 	Kích hoạt (0) hoặc Ngừng
kích hoạt (1)

## NULL

Bảng 50: Bảng Anh
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 103 | Trang

-- 105 of 124 --

Hình 46: Danh sách bảng (4)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 104 | Trang

-- 106 of 124 --

Bảng NhanVien
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID Nhân viên 	PK, ID11

### 2 	ID_VaiTro 	INT 	ID vai trò 	FK, NULL

### 3 	MaCCCD 	VARCHAR(12) 	mã căn cước công dân 	NULL

### 4 	TenNV 	NVARCHAR(50) tên nhân viên 	NULL

### 5 	Tuoi 	INT 	tuổi nhân viên 	NULL

### 6 	Email 	VARCHAR(50) 	Email của nhân viên 	NULL

### 7 	SDT 	VARCHAR(50) 	số điện thoại của nhân

viên

## NULL

### 8 	DiaChi 	NVARCHAR(50) địa chỉ của nhân viên 	NULL

### 9 	MatKhau 	NVARCHAR(50) mật khẩu đăng nhập 	NULL

### 10 	MaNV 	NVARCHAR(10) mã nhân viên 	NULL

11 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
12 	create_by 	VARCHAR(50) 	Người tạo 	NULL
13 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
14 	update_by 	VARCHAR(50) 	Người sửa 	NULL
15 	deleted 	BIT 	Kích hoạt (0) hoặc
Ngừng kích hoạt (1)

## NULL

Bảng 51: Bảng NhanVien
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 105 | Trang

-- 107 of 124 --

Bảng VaiTro
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID vai trò 	PK, ID11

### 2 	TenVaiTro 	NVARCHAR(50) 	tên vai trò 	NULL

3 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
4 	create_by 	VARCHAR(50) 	Người tạo 	NULL
5 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
6 	update_by 	VARCHAR(50) 	Người sửa 	NULL
deleted 	BIT 	Kích hoạt (0) hoặc
Ngừng kích hoạt (1)

## NULL

Bảng 52: Bảng VaiTro
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 106 | Trang

-- 108 of 124 --

Hình 47: Danh sách bảng(5)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 107 | Trang

-- 109 of 124 --

Bảng Voucher
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID voucher 	PK, ID11

2 	maKM 	NVARCHAR(50) 	mã khuyến mãi 	NULL

### 3 	TenVC 	NVARCHAR(50) 	tên voucher 	NULL

4 	hinhThucGiamGia 	NVARCHAR(50) Hình thức voucher 	NULL
5 	mucGiamGia 	NVARCHAR(50) Mức giảm giá của
voucher

## NULL

6 giaTriDonHangToiThieu 	INT 	Mức tiền tối thiểu
có thể giảm

## NULL

### 7 	SoLuong 	INT 	số lượng voucher 	NULL

### 8 	NgayBatDau 	DATETIME2(7) 	ngày bắt đầu 	NULL

### 9 	NgayKetThuc 	DATETIME2(7) 	ngày kết thúc 	NULL

10 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
11 	create_by 	VARCHAR(50) 	Người tạo 	NULL
12 	update_at 	DATE 	Ngày sửa 	NULL
13 	update_by 	VARCHAR(50) 	Người sửa 	NULL
14 	deleted 	BIT 	Kích hoạt (0) hoặc
Ngừng kích hoạt
(1)

## NULL

Bảng 53: Bảng Voucher
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 108 | Trang

-- 110 of 124 --

Bảng GiamGia_SPCT
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID voucher 	PK, ID11

2 	id_SPCT 	INT 	ID sản phẩm chi tiết 	FK, NULL
3 	id_Voucher 	INT 	ID voucher 	FK, NULL
4 	soTienGiam 	MONEY 	số tiền giảm 	NULL

### 5 	TrangThai 	NVARCHAR(50) 	số lượng voucher 	NULL

### 6 	NgayBatDau 	DATETIME2(7) 	ngày bắt đầu 	NULL

### 7 	NgayKetThuc 	DATETIME2(7) 	ngày kết thúc 	NULL

8 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
9 	create_by 	VARCHAR(50) 	Người tạo 	NULL
10 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
11 	update_by 	VARCHAR(50) 	Người sửa 	NULL
12 	deleted 	BIT 	Kích hoạt (0) hoặc
Ngừng kích hoạt (1)

## NULL

Bảng 54: Bảng Voucher
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 109 | Trang

-- 111 of 124 --

Hình 48: Danh sách bảng(6)
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 110 | Trang

-- 112 of 124 --

Bảng KhachHang
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID khách hàng 	PK, ID11

2 	tenKH 	NVARCHAR(50) 	tên khách hàng 	NULL

### 3 	Email 	VARCHAR(50) 	Email của khách hàng 	NULL

### 4 	GioiTinh 	BIT 	giới tính khách hàng 	NULL

### 5 	MaKH 	NVARCHAR(10) 	mã khách hàng 	NULL

### 6 	NgaySinh 	DATETIME2(7) 	ngày sinh của khách

hàng

## NULL

7 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
8 	create_by 	VARCHAR(50) 	Người tạo 	NULL
9 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
10 	update_by 	VARCHAR(50) 	Người sửa 	NULL
11 	deleted 	BIT 	Kích hoạt (0) hoặc
Ngừng kích hoạt (1)

## NULL

Bảng 55: Bảng KhachHang
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 111 | Trang

-- 113 of 124 --

Bảng KhachHang_Voucher
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID của

khachhang_voucher

## PK, ID11

### 2 	ID_KhachHang 	INT 	ID khách hàng 	FK, NULL

### 3 	ID_VC 	INT 	ID voucher 	FK, NULL

4 	soLuong 	INT 	số lượng voucher 	NULL

### 5 	TrangThai 	NVARCHAR(50) 	trạng thái 	NULL

6 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
7 	create_by 	VARCHAR(50) 	Người tạo 	NULL
8 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
9 	update_by 	VARCHAR(50) 	Người sửa 	NULL
10 	deleted 	BIT 	Kích hoạt (0) hoặc
Ngừng kích hoạt (1)

## NULL

Bảng 56: Bảng KhachHang_Voucher
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 112 | Trang

-- 114 of 124 --

Bảng DiaChi
STT 	Tên trường 	Kiểu dữ liệu 	Mô tả 	Ràng buộc

### 1 	ID 	INT 	ID địa chỉ 	PK, ID11

### 2 	ID_KhachHang 	INT 	ID khách hàng 	FK, NULL

### 3 	ThanhPho 	NVARCHAR(50) 	tên thành phố 	NULL

### 4 	Quan_Huyen 	NVARCHAR(50) 	tên quận huyện 	NULL

### 5 	Xa_Phuong 	NVARCHAR(50) 	tên xã phường 	NULL

### 6 	DiaChiChiTiet NVARCHAR(MAX) 	địa chỉ chi tiết 	NULL

7 	create_at 	DATETIME2(7) 	Ngày tạo 	NULL
8 	create_by 	VARCHAR(50) 	Người tạo 	NULL
9 	update_at 	DATETIME2(7) 	Ngày sửa 	NULL
10 	update_by 	VARCHAR(50) 	Người sửa 	NULL
11 	deleted 	BIT 	Kích hoạt (0) hoặc
Ngừng kích hoạt (1)

## NULL

Bảng 57: Bảng DiaChi
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 113 | Trang

-- 115 of 124 --

### 3.3 Giao diện người dùng

### 3.3.1 Sơ đồ giao diện

### 3.3.2 Giao diện phác thảo

Màn hình bán hàng
Hình 49: Màn hình bán hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 114 | Trang

-- 116 of 124 --

Màn hình quản lý hóa đơn
Hình 50: Màn hình quản lý hóa đơn
Màn hình quản lý sản phẩm
Hình 51: Màn hình quản lý sản phẩm
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 115 | Trang

-- 117 of 124 --

Màn hình quản lý voucher
Hình 52: Màn hình quản lý voucher
Màn hình quản lý khách hàng
Hình 53: Màn hình quản lý khách hàng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 116 | Trang

-- 118 of 124 --

Màn hình quản lý nhân viên
Hình 54: Màn hình quản lý nhân viên
Màn hình thống kê doanh thu
Hình 55: Màn hình hình thống kê doanh thu
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 117 | Trang

-- 119 of 124 --

## PHẦN 4: THỰC THI

### 4.1 Tổ chức mã nguồn

### 4.1.1 Sơ đồ tổ chức

### 4.1.2 Thư viện sử dụng

STT 	Tên thư viện 	Phiên bản 	Bản quyền
1 	activation 	3.1.3 	Apache 2.0
2 	barcode
3 	core-3.3.0 	3.3.0
4 	flatlaf-3.2.5 	3.2.5
5 	flatlaf-3.2 	3.2
6 	javase-3.3.0 	3.3.0
7 	javax.mail
8 	jfreechart-1.5.4 	1.5.3 	GNU Lesser General
Public License

## (LGPL)

9 	log4j-1.2.17 	1.2.17 	Apache License 2.0
10 	mail
11 	miglayout-core
12 	miglayout-swing
13 	mssql-jdbc-7.4.1.jre12 	7.4.1 	Microsoft Corporation
(Commercial)
14 	poi-4.0.1 	4.0.1 	Apache License 2.0
15 	poi-ooxml-4.0.1 	4.0.1 	Apache License 2.0
16 	poi-ooxml-schemas-4.0.1 	4.0.1 	Apache License 2.0
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 118 | Trang

-- 120 of 124 --

17 	qrgen-1.0 	1.0

### 18 	RojeruSan.parte1 	1

19 	slf4j-api-1.6.2 	1.6.2 	MIT License
20 	slf4j-log4j12-1.6.2 	1.6.2 	MIT License
21 	swing-crazy-panel-1.0.0 	1.0.0
22 	timingframework-1.0 	1.0 	BSD License

### 23 	Webcam

24 	webcam-capture-0.3.12 	0.3.12 	GNU Lesser General
Public License

## (LGPL)

25 	xmlbeans-3.0.2 	3.0.2 	Apache License 2.0
26 	zxing-core-1.7 	1.7 	Apache License 2.0
27 	zxing-j2se-1.7 	1.7 	Apache License 2.0
28 	pdfbox-app-2.0.30 	2.0.30
Bảng 58: Thư viện sử dụng
4.2 Đặc tả chức năng
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 119 | Trang

-- 121 of 124 --

## KIỂM THỬ

### 4.3 Kế hoạch kiểm thử

### 4.3.1 Tiêu chí cần đạt

- Trải Nghiệm Người Dùng (UX):
- Giao diện người dùng thân thiện và dễ sử dụng.
- Tìm kiếm sản phẩm nhanh chóng và chính xác.
- Quy trình thanh toán đơn giản và an toàn.
- Tính Năng Tăng Cường:
- Tính năng tìm kiếm và lọc sản phẩm đa dạng.
- Hệ thống đánh giá và đánh giá sản phẩm từ người dùng.
- Khả năng tương tác với hệ thống quản lý hàng tồn kho.
- Hiệu Suất:
- Tốc độ tải trang nhanh để tránh làm mất hứng thú của người dùng.
- Ổn định và ít lỗi kỹ thuật.
- Tích Hợp Thanh Toán An Toàn:
- Các phương thức thanh toán đa dạng và an toàn.
- Giao diện thanh toán bảo mật để bảo vệ thông tin người dùng.
- Quản Lý Đơn Hàng Hiệu Quả:
- Tình năng theo dõi đơn hàng và cập nhật trạng thái đơn hàng.
- Thông báo tự động về quá trình vận chuyển và giao hàng.
- Đối Tác Vận Chuyển:
- Liên kết với các đối tác vận chuyển đáng tin cậy để đảm bảo giao hàng đúng hẹn.
- Tương Thích Đa Nền Tảng:
- Hỗ trợ trên nhiều nền tảng và thiết bị khác nhau (điện thoại di động, máy tính bảng, máy
tính).
- Bảo Mật Thông Tin Khách Hàng:
- Bảo vệ thông tin cá nhân và thanh toán của khách hàng bằng các biện pháp bảo mật mạnh
mẽ.
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 120 | Trang

-- 122 of 124 --

### 4.3.2 Chiến lược triển khai

-Bước 1: Xác Định Mục Tiêu Kiểm Thử.
-Bước 2: Lập Kế Hoạch Kiểm Thử.
-Bước 3: Chọn Công Cụ Kiểm Thử.
-Bước 4: Phát Triển Kịch Bản Kiểm Thử.
-Bước 5: Thực Hiện Kiểm Thử.
-Bước 6: Đánh Giá Hiệu Suất
-Bước 7: Xử Lý Lỗi.
-Bước 8: Kiểm Thử Cuối Cùng và Chấp Nhận

### 4.4 Thống kê kết quả

Chức năng 	Thời gian
làm dự kiến
Người thực hiện Số Test
Case
Kết quả
Bán hàng 	4h
Nguyễn Huy Tấn

### 9 	Thành công

Đăng nhập 	1h 	13 	11 Pass, 2 Fail
Quản lý sản phẩm 	5h 	9 	Thành công
Quản lý khách hàng 3h 	4 	Thành công
Quản lý nhân viên 	3h 	8 	7 Pass, 1 Fail
Quản lý đơn hàng 	3h 	7 	6 Pass, 1 Fail
Quản lý thống kê 	2h 	5 	Thành công
Quản lý mã giảm giá 2h 	5 	4 Pass, 1 Fail
Tổng số lượng Test Case 	60 	91,6% Thành công,
8,4% Fail
Bảng 59: Bảng tổng hợp kết quả kiểm thử4
4
https://docs.google.com/spreadsheets/d/1oL9jh2hgzswEPmmbxaRY6L547zeTSD_D/edit#gid=87
2492866
Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 121 | Trang

-- 123 of 124 --

Xây dựng phần mềm bán giày thể thao sneaker Sport-Shop 122 | Trang

-- 124 of 124 --