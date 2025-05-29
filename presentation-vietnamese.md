# Hệ thống Danh tính Bảo vệ Quyền riêng tư (PPIDS) và Zero-Knowledge Proofs (ZKP)

Tài liệu này cung cấp tổng quan toàn diện về các hệ thống danh tính bảo vệ quyền riêng tư, giải thích tại sao Danh tính Tự chủ (SSI) là nền tảng tối ưu cho việc triển khai Zero-Knowledge Proofs (ZKP), và minh họa cách các công nghệ này tích hợp trong kiến trúc doanh nghiệp để cung cấp các giải pháp danh tính an toàn, riêng tư và có thể mở rộng.

## Mục lục

1. [Hệ thống Danh tính Bảo vệ Quyền riêng tư (PPIDS)](#1-hệ-thống-danh-tính-bảo-vệ-quyền-riêng-tư-ppids)
    - [Tiến hóa của Danh tính Số](#tiến-hóa-của-danh-tính-số)
    - [So sánh các Mô hình Danh tính](#so-sánh-các-mô-hình-danh-tính)
    - [Tại sao các Hệ thống Truyền thống Thất bại trong Bảo vệ Quyền riêng tư](#tại-sao-các-hệ-thống-truyền-thống-thất-bại-trong-bảo-vệ-quyền-riêng-tư)
2. [Danh tính Tự chủ (SSI): Nền tảng cho ZKP](#2-danh-tính-tự-chủ-ssi-nền-tảng-cho-zkp)
    - [Nguyên tắc và Kiến trúc SSI](#nguyên-tắc-và-kiến-trúc-ssi)
    - [Tại sao chỉ có SSI mới Cho phép ZKP Thực sự](#tại-sao-chỉ-có-ssi-mới-cho-phép-zkp-thực-sự)
    - [Nền tảng Mật mã](#nền-tảng-mật-mã)
3. [Kiến trúc Doanh nghiệp cho Hệ thống Bảo vệ Quyền riêng tư](#3-kiến-trúc-doanh-nghiệp-cho-hệ-thống-bảo-vệ-quyền-riêng-tư)
    - [Góc nhìn Kiến trúc Phân tầng](#góc-nhìn-kiến-trúc-phân-tầng)
    - [Khung Kiến trúc Bảo mật](#khung-kiến-trúc-bảo-mật)
    - [Vị trí ZKP trong Hệ thống Doanh nghiệp](#vị-trí-zkp-trong-hệ-thống-doanh-nghiệp)
    - [Mô hình Triển khai Thực tế](#mô-hình-triển-khai-thực-tế)
4. [Từ Lý thuyết đến Thực hiện](#4-từ-lý-thuyết-đến-thực-hiện)
    - [Luồng Triển khai Kỹ thuật](#luồng-triển-khai-kỹ-thuật)
    - [Điểm Tích hợp](#điểm-tích-hợp)
5. [Triển khai Zero-Knowledge Proofs (ZKP) với IOTA Identity](#5-triển-khai-zero-knowledge-proofs-zkp-với-iota-identity)
    - [Tổng quan về ZKP và Tiết lộ Có chọn lọc](#tổng-quan-về-zkp-và-tiết-lộ-có-chọn-lọc)
    - [Hướng dẫn Triển khai Từng bước](#hướng-dẫn-triển-khai-từng-bước)

---

## 1. Hệ thống Danh tính Bảo vệ Quyền riêng tư (PPIDS)

### Tiến hóa của Danh tính Số

Quản lý danh tính số đã trải qua quá trình tiến hóa đáng kể, được thúc đẩy bởi những mối quan tâm về quyền riêng tư ngày càng tăng, các yêu cầu quy định và tiến bộ công nghệ. Hiểu được sự tiến hóa này là rất quan trọng để đánh giá tại sao Zero-Knowledge Proofs (ZKP) đại diện cho một bước đột phá cơ bản trong xác minh danh tính bảo vệ quyền riêng tư.

Hành trình từ các hệ thống danh tính tập trung đến kiến trúc bảo vệ quyền riêng tư phản ánh những thay đổi rộng lớn hơn trong cách chúng ta khái niệm hóa quyền sở hữu dữ liệu, quyền riêng tư của người dùng và mối quan hệ tin cậy trong các hệ thống số.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TIẾN HÓA CỦA DANH TÍNH SỐ                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  THỜI KỲ TẬP TRUNG (1990s-2000s)                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ • Một cơ quan duy nhất kiểm soát toàn bộ dữ liệu danh tính             │ │
│  │ • Người dùng không có quyền kiểm soát thông tin của họ                 │ │
│  │ • Rủi ro cao về vi phạm dữ liệu và lạm dụng                            │ │
│  │ • Quyền riêng tư chỉ là suy nghĩ sau                                   │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│                                    ▼                                        │
│  THỜI KỲ LIÊN KẾT (2000s-2010s)                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ • Nhà cung cấp danh tính quản lý thông tin đăng nhập cho nhiều dịch vụ │ │
│  │ • Giảm mệt mỏi mật khẩu nhưng tăng theo dõi                            │ │
│  │ • Mối quan tâm về quyền riêng tư với giám sát IdP                      │ │
│  │ • Vẫn là mô hình tin cậy tập trung                                     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│                                    ▼                                        │
│  THỜI KỲ TỰ CHỦ (2010s-Hiện tại)                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ • Người dùng kiểm soát dữ liệu danh tính của chính họ                  │ │
│  │ • Tin cậy phi tập trung thông qua mật mã                               │ │
│  │ • Quyền riêng tư theo thiết kế với tiết lộ có chọn lọc                 │ │
│  │ • Zero-Knowledge Proofs (ZKP) cho phép quyền riêng tư thực sự          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### So sánh các Mô hình Danh tính

Quản lý danh tính số đã phát triển từ các hệ thống tập trung qua mô hình liên kết đến phương pháp tự chủ ngày nay. Mỗi mô hình khác nhau về cách lưu trữ dữ liệu danh tính, ai kiểm soát nó và cách xử lý quyền riêng tư. Bảng sau tóm tắt những khác biệt chính giữa các hệ thống danh tính tập trung, liên kết và tự chủ:

| **Khía cạnh**         | **Danh tính Tập trung**                                                                                                                                                                                                                                  | **Danh tính Liên kết**                                                                                                                                                                                                                                                                                                                                        | **Danh tính Tự chủ (SSI)**                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kiểm soát Dữ liệu** | Kiểm soát ít của người dùng: một cơ quan trung tâm (ví dụ: cơ quan chính phủ hoặc công ty) duy trì và kiểm soát dữ liệu danh tính. Người dùng phải tin tưởng thực thể duy nhất này.                                                                      | Kiểm soát chia sẻ: các nhà cung cấp danh tính (IdP) như Google hoặc Facebook quản lý thông tin đăng nhập người dùng, nhưng người dùng có thể truy cập nhiều dịch vụ qua IdP. IdP làm trung gian tin cậy giữa người dùng và nhà cung cấp dịch vụ.                                                                                                              | Kiểm soát lấy người dùng làm trung tâm: người dùng hoàn toàn kiểm soát dữ liệu danh tính của họ trong ví cá nhân. Không có cơ quan nào có thể thay đổi hoặc thu hồi danh tính mà không có sự đồng ý của người dùng.                                                                                                                                                                                                                 |
| **Lưu trữ Dữ liệu**   | Lưu trữ trong cơ sở dữ liệu tập trung hoặc thư mục. Thông tin danh tính được giữ trong một silo, tạo ra điểm lỗi duy nhất.                                                                                                                               | Lưu trữ bởi nhà cung cấp danh tính và đôi khi chuyển tiếp đến các nhà cung cấp dịch vụ khác nhau. Dữ liệu có thể được sao chép trên nhiều dịch vụ (ví dụ: mỗi dịch vụ nhận một số dữ liệu người dùng từ IdP).                                                                                                                                                 | Lưu trữ bởi người dùng (thường là cục bộ) dưới dạng thông tin đăng nhập di động. Sổ cái phi tập trung công khai chỉ lưu trữ định danh hoặc khóa công khai, không phải dữ liệu cá nhân.                                                                                                                                                                                                                                              |
| **Quyền riêng tư**    | Quyền riêng tư thấp: người dùng thường phải tiết lộ nhiều dữ liệu cá nhân cho thực thể trung tâm và mỗi dịch vụ. Cơ sở dữ liệu trung tâm có thể thấy và ghi lại tất cả việc sử dụng. Dữ liệu có thể được tái sử dụng ngoài tầm kiểm soát của người dùng. | Quyền riêng tư vừa phải: giảm việc nhập thông tin đăng nhập lặp lại, nhưng IdP biết khi nào và ở đâu người dùng đăng nhập. Người dùng thường đồng ý chia sẻ dữ liệu rộng rãi với IdP. Theo dõi qua các dịch vụ bởi IdP là có thể. Dữ liệu cá nhân vẫn có thể được chia sẻ rộng rãi với mỗi dịch vụ trong quá trình đăng nhập (ví dụ: chi tiết hồ sơ của bạn). | Quyền riêng tư cao: tiết lộ tối thiểu theo thiết kế. Người dùng chỉ chia sẻ các thuộc tính cụ thể khi cần (ví dụ: bằng chứng tuổi, không phải ngày sinh đầy đủ). Trao đổi thường được che khuất bằng mật mã, vì vậy ngay cả các bên xác minh cũng chỉ biết những gì thực sự cần thiết. Không có nhật ký trung tâm của tất cả giao dịch tồn tại.                                                                                     |
| **Bảo mật & Rủi ro**  | Điểm tấn công trung tâm: vi phạm kho lưu trữ trung tâm có thể làm rò rỉ hàng triệu danh tính. Người dùng dễ bị tổn thương nếu cơ quan trung tâm bị xâm phạm hoặc bất cẩn.                                                                                | Rủi ro liên kết: nếu IdP liên kết bị vi phạm, có thể làm lộ quyền truy cập vào nhiều tài khoản được liên kết. Ngoài ra, nếu thông tin đăng nhập người dùng tại IdP bị đánh cắp, nhiều dịch vụ có nguy cơ. Tuy nhiên, các hệ thống liên kết có thể giảm việc tái sử dụng mật khẩu (cải thiện bảo mật theo nghĩa đó).                                           | Bảo mật phi tập trung: không có điểm lỗi duy nhất. Xâm phạm một thông tin đăng nhập hoặc một nhà phát hành không làm lộ tất cả dữ liệu người dùng. Vi phạm được giới hạn vì dữ liệu không được tổng hợp ở một nơi. Việc sử dụng mã hóa và ZKP bảo vệ thêm chống rò rỉ dữ liệu.                                                                                                                                                      |
| **Phụ thuộc**         | Hoàn toàn phụ thuộc vào nhà cung cấp trung tâm. Nếu nhà cung cấp đó offline hoặc ngừng hoạt động, danh tính có thể trở nên không sử dụng được ở nơi khác. Người dùng không có cách thay thế để chứng minh danh tính.                                     | Phụ thuộc cao vào nhà cung cấp danh tính. Nếu dịch vụ IdP ngừng hoạt động (hoặc tài khoản bị chặn), người dùng có thể bị khóa khỏi nhiều dịch vụ. Người dùng cũng phải tin tưởng các chính sách của IdP.                                                                                                                                                      | Không phụ thuộc duy nhất vào nhà cung cấp. Nhiều nhà phát hành có thể cung cấp thông tin đăng nhập (ví dụ: chính phủ cho ID, ngân hàng cho chứng thực tài chính, trường đại học cho bằng cấp). Ngay cả khi một nhà phát hành không thể truy cập được, các thông tin đăng nhập khác vẫn hợp lệ. Xác minh thường có thể xảy ra offline bằng cách kiểm tra chữ ký số, mà không cần truy vấn cơ sở dữ liệu trực tiếp đến nhà phát hành. |
| **Ví dụ**             | Thư mục nhân viên công ty; mạng xã hội yêu cầu tài khoản riêng để truy cập dịch vụ của họ; cơ sở dữ liệu ID chính phủ được sử dụng nghiêm ngặt trong các hệ thống chính phủ.                                                                             | Hệ thống đăng nhập liên kết như Facebook Connect hoặc Google Sign-In (một lần đăng nhập cho phép truy cập các trang web bên thứ ba); Đăng nhập một lần của công ty trong doanh nghiệp (ví dụ: sử dụng SAML hoặc OAuth với IdP như Okta).                                                                                                                      | Khung danh tính phi tập trung như mạng Sovrin/Hyperledger Indy cho thông tin đăng nhập, các giải pháp Ethereum + DID (ví dụ: uPort/Polygon ID), hoặc Microsoft ION (mạng DID trên Bitcoin). Những điều này cho phép thông tin đăng nhập di động qua các miền.                                                                                                                                                                       |

**Bảng 1: So sánh các Mô hình Danh tính Tập trung, Liên kết và Tự chủ**

Trong SSI, cá nhân nắm giữ "nguồn sự thật" về danh tính của họ (dưới dạng thông tin đăng nhập có thể xác minh) thay vì dựa vào nhà cung cấp để bảo vệ họ mỗi lần. Mô hình này giải quyết nhiều vấn đề của các hệ thống trước đó. Ví dụ, danh tính tập trung có thể dẫn đến vi phạm dữ liệu "honeypot", và danh tính liên kết, mặc dù thân thiện với người dùng hơn, lại gây ra vấn đề quyền riêng tư với các nhà cung cấp danh tính theo dõi đăng nhập người dùng và chia sẻ dữ liệu ngoài tầm kiểm soát của người dùng. Ngược lại, phương pháp phi tập trung của SSI có thể loại bỏ các điểm lỗi trung tâm và giảm thiểu dấu vết dữ liệu, tăng cường cả bảo mật và quyền riêng tư.

### Tại sao các Hệ thống Truyền thống Thất bại trong Bảo vệ Quyền riêng tư

Một sự khác biệt thực tế được thấy trong quá trình xác thực. Trong đăng nhập liên kết (ví dụ: "Đăng nhập bằng Google"), Google xác thực người dùng và sau đó chia sẻ khẳng định về danh tính người dùng cho ứng dụng bên thứ ba – nhưng Google biết nơi người dùng đang đăng nhập và có thể chia sẻ hoặc kiếm tiền từ kiến thức đó. Trong tình huống SSI, người dùng thay vào đó có thể trình bày thông tin đăng nhập có thể xác minh (được phát hành, ví dụ, bởi nhà cung cấp KYC đáng tin cậy hoặc chính phủ) trực tiếp cho ứng dụng. Google (hoặc bất kỳ trung gian nào) không tham gia, vì vậy không có bên nào khác biết về giao dịch này. Ứng dụng có thể xác minh cục bộ chữ ký của thông tin đăng nhập (tùy chọn kiểm tra sổ đăng ký phi tập trung cho khóa công khai của nhà phát hành hoặc trạng thái thu hồi thông tin đăng nhập), và quyền riêng tư của người dùng được bảo vệ.

"Tam giác tin cậy" của nhà phát hành-người nắm giữ-người xác minh trong SSI hiệu quả thay thế trung tâm một-đến-nhiều của các hệ thống IdP liên kết bằng mô hình phân tán nơi tin cậy được neo trong mật mã và thường là blockchain thay vì trong một tổ chức duy nhất.

Các thất bại quyền riêng tư cơ bản của các hệ thống truyền thống xuất phát từ các giả định kiến trúc của chúng:

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                THẤT BẠI QUYỀN RIÊNG TƯ TRONG HỆ THỐNG TRUYỀN THỐNG                │
├───────────────────────────────────────────────────────────────────────────────────┤
│                                                                                   │
│  HỆ THỐNG TẬP TRUNG                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │                          VẤN ĐỀ QUYỀN RIÊNG TƯ                               │ │
│  │                                                                              │ │
│  │ • Tiết lộ Tất cả hoặc Không có gì: Người dùng phải chia sẻ hồ sơ đầy đủ      │ │
│  │ • Tổng hợp Dữ liệu: Hệ thống trung tâm xây dựng hồ sơ người dùng toàn diện   │ │
│  │ • Giám sát theo Thiết kế: Mọi giao dịch đều được ghi và theo dõi             │ │
│  │ • Khóa Nhà cung cấp: Người dùng không thể chuyển danh tính sang hệ thống khác│ │
│  │ • Hiệu ứng Honeypot: Cơ sở dữ liệu tập trung trở thành mục tiêu hấp dẫn      │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                   │
│  HỆ THỐNG LIÊN KẾT                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────┐ │
│  │                          VẤN ĐỀ QUYỀN RIÊNG TƯ                               │ │
│  │                                                                              │ │
│  │ • Giám sát IdP: Nhà cung cấp danh tính theo dõi tất cả hoạt động người dùng  │ │
│  │ • Môi giới Dữ liệu: IdP kiếm tiền từ dữ liệu người dùng thông qua theo dõi   │ │
│  │ • Mệt mỏi Đồng ý: Người dùng phê duyệt chia sẻ dữ liệu rộng mà không xem xét │ │
│  │ • Tấn công Tương quan: IdP có thể tương quan hành vi người dùng qua các trang│ │
│  │ • Điểm Giám sát Duy nhất: Một thực thể thấy tất cả tương tác người dùng      │ │
│  └──────────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────────────┘
```

## 2. Danh tính Tự chủ (SSI): Nền tảng cho ZKP

### Nguyên tắc và Kiến trúc SSI

Danh tính Tự chủ (SSI) đại diện cho một sự thay đổi mô hình cho phép các hệ thống danh tính bảo vệ quyền riêng tư theo thiết kế. SSI được xây dựng trên mười nguyên tắc cơ bản trực tiếp cho phép triển khai Zero-Knowledge Proofs (ZKP):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       NGUYÊN TẮC SSI CHO PHÉP ZKP                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  NGUYÊN TẮC QUYỀN RIÊNG TƯ CỐT LÕI                                          │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 1. TỒN TẠI: Người dùng phải có sự tồn tại độc lập                      │ │
│  │ 2. KIỂM SOÁT: Người dùng phải kiểm soát danh tính của họ               │ │
│  │ 3. TRUY CẬP: Người dùng phải có quyền truy cập dữ liệu của chính họ    │ │
│  │ 4. MINH BẠCH: Hệ thống phải minh bạch với người dùng                   │ │
│  │ 5. KIÊN TRÌ: Danh tính phải tồn tại lâu dài                            │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                    │                                        │
│                                    ▼                                        │
│  NGUYÊN TẮC CHO PHÉP ZKP                                                    │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 6. TÍNH DI ĐỘNG: Danh tính phải có thể di động qua các hệ thống        │ │
│  │ 7. KHẢ NĂNG TƯƠNG TÁC: Danh tính phải hoạt động qua các nền tảng       │ │
│  │ 8. ĐỒNG Ý: Người dùng phải đồng ý sử dụng danh tính của họ             │ │
│  │ 9. TỐI THIỂU HÓA: Tiết lộ phải được tối thiểu hóa                      │ │
│  │ 10. BẢO VỆ: Quyền người dùng phải được bảo vệ                          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ➤ NGUYÊN TẮC 8 & 9 TRỰC TIẾP CHO PHÉP ZERO-KNOWLEDGE PROOFS (ZKP)         │
│  ➤ TỐI THIỂU HÓA YÊU CẦU KHẢ NĂNG TIẾT LỘ CÓ CHỌN LỌC                      │
│  ➤ ĐỒNG Ý YÊU CẦU KIỂM SOÁT TINH CHỈNH VỀ TIẾT LỘ DỮ LIỆU                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

Kiến trúc SSI tạo ra nền tảng kỹ thuật cần thiết cho triển khai ZKP thông qua mô hình tin cậy phi tập trung:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                     KIẾN TRÚC TIN CẬY SSI CHO ZKP                             │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐         ┌─────────────────┐         ┌──────────────────┐ │
│  │  NHÀ PHÁT HÀNH  │         │  NGƯỜI GIỮ      │         │   NGƯỜI XÁC MINH │ │
│  │                 │         │                 │         │                  │ │
│  │ • Tạo VCs       │   VC    │ • Lưu trữ VCs   │   ZKP   │ • Xác minh ZKPs  │ │
│  │ • Ký bằng       │──────►  │ • Kiểm soát     │──────►  │ • Xác thực       │ │
│  │   chữ ký BBS+   │         │   tiết lộ       │         │   chữ ký         │ │
│  │ • Xuất bản Tài  │         │ • Tạo           │         │ • Kiểm tra độ    │ │
│  │   liệu DID      │         │   bằng chứng ZK │         │   tin cậy nhà ph │ │
│  └─────────────────┘         └─────────────────┘         └──────────────────┘ │
│           │                           │                           │           │
│           │                           │                           │           │
│           └───────────────────────────┼───────────────────────────┘           │
│                                       │                                       │
│                     NEO TIN CẬY MẬT MÃ                                        │
│                                       │                                       │
│                       ┌───────────────▼────────────────┐                      │
│                       │      MẠNG IOTA TANGLE          │                      │
│                       │                                │                      │
│                       │ • Lưu trữ DID bất biến         │                      │
│                       │ • Phân phối khóa công khai     │                      │
│                       │ • Sổ đăng ký thu hồi           │                      │
│                       │ • Không lưu trữ dữ liệu cá nhân│                      │
│                       └────────────────────────────────┘                      │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Tại sao chỉ có SSI mới Cho phép ZKP Thực sự

Zero-Knowledge Proofs (ZKP) trong hệ thống danh tính yêu cầu các điều kiện tiên quyết kiến trúc cụ thể mà chỉ có Danh tính Tự chủ (SSI) mới có thể cung cấp:

**1. Lưu trữ Dữ liệu do Người giữ Kiểm soát**

-   Hệ thống truyền thống lưu trữ dữ liệu danh tính trong cơ sở dữ liệu trung tâm do cơ quan kiểm soát
-   SSI lưu trữ thông tin đăng nhập trong ví do người dùng kiểm soát, cho phép tạo bằng chứng phía khách hàng
-   Chỉ có người giữ mới có thể quyết định thông tin nào tiết lộ hoặc che giấu

**2. Định dạng Thông tin đăng nhập Mật mã**

-   Hệ thống truyền thống sử dụng bản ghi cơ sở dữ liệu hoặc tài liệu đã ký không hỗ trợ tiết lộ có chọn lọc
-   SSI sử dụng thông tin đăng nhập có thể xác minh có cấu trúc mật mã được thiết kế cho các hoạt động ZKP
-   Chữ ký BBS+ cho phép tạo bằng chứng toán học mà không tiết lộ các thuộc tính ẩn

**3. Xác minh Phi tập trung**

-   Hệ thống truyền thống yêu cầu truy vấn thời gian thực đến cơ quan trung tâm để xác minh
-   SSI cho phép xác minh offline thông qua xác thực chữ ký mật mã
-   Người xác minh có thể xác thực bằng chứng mà không cần liên hệ với nhà phát hành hoặc tiết lộ sự kiện xác minh

**4. Tin cậy thông qua Mật mã, Không phải Tổ chức**

-   Hệ thống truyền thống yêu cầu tin tưởng vào cơ quan trung tâm hoặc nhà cung cấp danh tính
-   SSI neo tin cậy trong bằng chứng toán học và xác minh sổ cái phân tán
-   Tính chất không kiến thức được đảm bảo bởi giao thức mật mã, không phải lời hứa chính sách

### Nền tảng Mật mã

IOTA Identity cho phép Zero-Knowledge Proofs (ZKP) thông qua chữ ký BBS+:

**Tính chất Chính:**

-   **Ký nhiều thông điệp**: Có thể ký nhiều thuộc tính độc lập
-   **Tiết lộ có chọn lọc**: Chỉ tiết lộ các thuộc tính được chọn
-   **Không kiến thức**: Chứng minh kiến thức mà không tiết lộ dữ liệu ẩn
-   **Không thể liên kết**: Các bằng chứng không thể được tương quan

## 3. Kiến trúc Doanh nghiệp cho Hệ thống Bảo vệ Quyền riêng tư

### Góc nhìn Kiến trúc Phân tầng

Góc nhìn kiến trúc phân tầng cho thấy cách ZKP phù hợp trong hệ thống SSI doanh nghiệp từ góc độ kinh doanh xuống đến triển khai:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                      KIẾN TRÚC PHÂN TẦNG DOANH NGHIỆP                         │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                        TẦNG KINH DOANH                                  │  │
│  │  • Yêu cầu Xác minh Danh tính                                           │  │
│  │  • Tuân thủ Quyền riêng tư (GDPR, CCPA)                                 │  │
│  │  • Chính sách Khung Tin cậy                                             │  │
│  │  • Mục tiêu Trải nghiệm Khách hàng                                      │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      TẦNG ỨNG DỤNG                                      │  │
│  │  • Ứng dụng Ví SSI                                                      │  │
│  │  • Cổng thông tin Người xác minh                                        │  │
│  │  • Hệ thống Quản lý Nhà phát hành                                       │  │
│  │  • Dịch vụ Phân giải DID                                                │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      TẦNG TÍCH HỢP                                      │  │
│  │  • Cổng API                                                             │  │
│  │  • Điều phối Dịch vụ                                                    │  │
│  │  • Hàng đợi Thông điệp                                                  │  │
│  │  • Luồng Sự kiện                                                        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                         TẦNG ZKP                                        │  │
│  │  • Tạo Zero-Knowledge Proofs                                            │  │
│  │  • Logic Tiết lộ Có chọn lọc                                            │  │
│  │  • Hoạt động Chữ ký BBS+                                                │  │
│  │  • Xác minh Mật mã                                                      │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                      TẦNG GIAO THỨC                                     │  │
│  │  • Khung IOTA Identity                                                  │  │
│  │  • Phân giải DID                                                        │  │
│  │  • Thông tin đăng nhập Có thể xác minh                                  │  │
│  │  • Triển khai Tiêu chuẩn W3C                                            │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                    TẦNG HẠ TẦNG                                         │  │
│  │  • Mạng IOTA Tangle                                                     │  │
│  │  • Dịch vụ Đám mây (AWS, Azure, GCP)                                    │  │
│  │  • Điều phối Container (Kubernetes)                                     │  │
│  │  • Hệ thống Cơ sở dữ liệu                                               │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Khung Kiến trúc Bảo mật

Mô hình SABSA (Sherwood Applied Business Security Architecture) cho bảo mật hệ thống ZKP:

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                       KIẾN TRÚC BẢO MẬT SABSA                                        │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │  KINH DOANH │  │  KIẾN TRÚC  │  │  THIẾT KẾ   │  │  XÂY DỰNG   │  │  THỢ THỦ   │  │
│  │(Bối cảnh)   │  │(Khái niệm)  │  │  (Logic)    │  │ (Vật lý)    │  │CÔNG(Thành  │  │
│  │             │  │             │  │             │  │             │  │  phần)     │  │
│  │ • Nhu cầu   │  │ • Mô hình   │  │ • Giao thức │  │ • IOTA      │  │ • Đường    │  │
│  │   Danh tính │  │   Tin cậy   │  │   ZKP       │  │   Tangle    │  │   cong     │  │
│  │ • Luật      │  │ • Chính sách│  │ • Sơ đồ     │  │ • Node.js   │  │ • Ràng buộc│  │
│  │   Quyền r.t │  │   Bảo mật   │  │   BBS+      │  │   Runtime   │  │ • IOTA     │  │
│  │ • Quy tắc   │  │ • Kiểm soát │  │ • Tiết lộ   │  │ • Hệ thống  │  │   Identity │  │
│  │   Tuân thủ  │  │   Truy cập  │  │  Có chọn lọc│  │   Cơ sở DL  │  │   SDK      │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
│                                                                                      │
│  ┌────────────────────────────────────────────────────────────────────────────────┐  │
│  │           HỆ THỐNG QUẢN LÝ DỊCH VỤ BẢO MẬT                                     │  │
│  │                                                                                │  │
│  │  • Giám sát & Cảnh báo Bảo mật                                                 │  │
│  │  • Quản lý & Xoay Khóa                                                         │  │
│  │  • Phản ứng & Khôi phục Sự cố                                                  │  │
│  │  • Kiểm toán & Báo cáo Tuân thủ                                                │  │
│  │  • Đánh giá & Quản lý Rủi ro                                                   │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Vị trí ZKP trong Hệ thống Doanh nghiệp

Vị trí của công nghệ ZKP trong hệ thống SSI doanh nghiệp rộng lớn hơn:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                  VỊ TRÍ ZKP TRONG SSI DOANH NGHIỆP                            │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Cấp Doanh nghiệp: QUẢN TRỊ DANH TÍNH                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • Quản lý Vòng đời Danh tính                                            │  │
│  │ • Quản trị Khung Tin cậy                                                │  │
│  │ • Thực thi Chính sách Quyền riêng tư                                    │  │
│  │ • Quản lý Tuân thủ Quy định                                             │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  Cấp Hệ thống: HỆ SINH THÁI SSI                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐       │  │
│  │  │ HỆ THỐNG  │    │    VÍ     │    │ CỔNG THÔNG│    │    SỔ     │       │  │
│  │  │NHÀ PH HÀNH│    │ NGƯỜI GIỮ │    │TIN NG.XM  │    │ĐĂNG KÝ DID│       │  │
│  │  └───────────┘    └───────────┘    └───────────┘    └───────────┘       │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  Cấp Thành phần: TÍCH HỢP ZKP                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │              ┌─────────────────────────────────┐                        │  │
│  │              │         ĐỘNG CƠ ZKP             │                        │  │
│  │              │                                 │                        │  │
│  │  Tạo         │  • Logic Tiết lộ Có chọn lọc    │      Động cơ           │  │
│  │  Bằng chứng  │  • Hoạt động Chữ ký BBS+        │      Xác minh          │  │
│  │  ────────────│  • Giao thức Không Kiến thức    │──────────────────────► │  │
│  │              │  • Bảo vệ Quyền riêng tư         │                       │  │
│  │              └─────────────────────────────────┘                        │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  Cấp Kỹ thuật: NỀN TẢNG MẬT MÃ                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • Khung IOTA Identity                                                   │  │
│  │ • Mật mã Đường cong Elliptic BLS12-381                                  │  │
│  │ • Hoạt động Mật mã dựa trên Ghép cặp                                    │  │
│  │ • Sổ cái Phân tán IOTA Tangle                                           │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Mô hình Triển khai Thực tế

Trong các tình huống triển khai doanh nghiệp thực tế, các hệ thống SSI hỗ trợ ZKP phải tích hợp với hạ tầng hiện có trong khi duy trì bảo đảm quyền riêng tư nghiêm ngặt:

```

┌───────────────────────────────────────────────────────────────────────────────┐
│                        TRIỂN KHAI THỰC TẾ                                     │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  CÁC BÊN LIÊN QUAN BÊN NGOÀI                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  Công dân/NĐ     │   Doanh nghiệp  │   Chính phủ     │   Đối tác        │  │
│  │  (Người giữ)     │   (Ng.xác minh) │   (Nhà ph hành) │   (Ng.xác thực)  │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  RANH GIỚI DOANH NGHIỆP                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                        DMZ (Vùng Phi quân sự)                           │  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐              │  │
│  │  │   Cổng API    │  │  Cân bằng tải │  │  Tường lửa      │              │  │
│  │  │ (Giới hạn tốc)│  │ (Khả dụng cao)│  │  Ứng dụng Web   │              │  │
│  │  └───────────────┘  └───────────────┘  └─────────────────┘              │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  TẦNG ỨNG DỤNG                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                │  │
│  │  │   Dịch vụ     │  │ Động cơ Tiết  │  │   Hệ thống    │                │  │
│  │  │   Phân giải   │  │ lộ Có chọn lọc│  │   Quản lý     │                │  │
│  │  │   DID         │  │ BBS+          │  │   Thông tin   │                │  │
│  │  │               │  │               │  │   đăng nhập   │                │  │
│  │  │ • Tài liệu DID│  │ • Tạo Bchứng  │  │ • Phát hành   │                │  │
│  │  │ • Quản lý Khóa│  │ • Xác minh    │  │ • Thu hồi     │                │  │
│  │  │ • Phân giải   │  │ • Quyền r.tư  │  │ • Theo dõi    │                │  │
│  │  │   Schema      │  │   Người giữ   │  │   Trạng thái  │                │  │
│  │  └───────────────┘  └───────────────┘  └───────────────┘                │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  TẦNG DỮ LIỆU                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                │  │
│  │  │   Cụm         │  │  Tầng Cache   │  │  Mạng IOTA    │                │  │
│  │  │   Cơ sở DL    │  │  (Redis)      │  │  Tangle       │                │  │
│  │  │               │  │               │  │               │                │  │
│  │  │ • Siêu dữ liệu│  │ • Phiên       │  │ • Tài liệu DID│                │  │
│  │  │ • Nhật ký KT  │  │ • Dữ liệu tạm │  │ • Khóa công   │                │  │
│  │  │ • Phân tích   │  │ • Tối ưu hóa  │  │ • Sổ đăng ký  │                │  │
│  │  │               │  │   Hiệu suất   │  │   Thu hồi     │                │  │
│  │  └───────────────┘  └───────────────┘  └───────────────┘                │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  **Tiết lộ Có chọn lọc BBS+ chủ yếu nằm trong TẦNG ỨNG DỤNG**                 │
│  **IOTA Identity SDK cung cấp nền tảng mật mã**                               │
│  **Kết nối với IOTA Tangle để neo DID bất biến**                              │
└───────────────────────────────────────────────────────────────────────────────┘

```

**Công nghệ Chính:**

-   **TypeScript/WASM** cho phát triển đa nền tảng
-   **IOTA Identity SDK** cho hoạt động DID và thông tin đăng nhập có thể xác minh
-   **Chữ ký BBS+** cho khả năng tiết lộ có chọn lọc
-   **IOTA Tangle** cho sổ đăng ký DID phi tập trung

## 4. Từ Lý thuyết đến Thực hiện

### Luồng Triển khai Kỹ thuật

Luồng triển khai ZKP hoàn chình minh họa cách lý thuyết quyền riêng tư được chuyển đổi thành thực tế kỹ thuật sử dụng IOTA Identity:

```
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│  NHÀ PHÁT HÀNH  │        │   NGƯỜI GIỮ     │        │  NGƯỜI XÁC MINH │
└────────┬────────┘        └────────┬────────┘        └────────┬────────┘
         │                          │                          │         
         │ 1. Tạo                   │                          │
         │ thông tin đăng nhập với  │                          │
         │ chữ ký BBS+(ZKP sẵn sàng)│                          │
         │                          │                          │
         │ 2. Phát hành thông tin   │                          │
         │ đăng nhập                │                          │
         │────────────────────────> │                          │
         │                          │                          │
         │                          │ 3. Lưu trữ thông tin     │
         │                          │ đăng nhập                │
         │                          │                          │
         │                          │ <─────────────────────── │
         │                          │ 4. Yêu cầu bằng chứng với│
         │                          │    thử thách             │
         │                          │                          │
         │                          │ 5. Tạo ZKP với           │
         │                          │    tiết lộ có chọn lọc   │
         │                          │    (ĐÂY LÀ NƠI ZKP       │
         │                          │     XẢY RA!)             │
         │                          │                          │
         │                          │ 6. Gửi bằng chứng        │
         │                          │    với ZKP               │
         │                          │ ────────────────────────>│
         │                          │                          │
         │                          │                          │ 7. Xác minh ZKP
         │                          │                          │    mà không thấy
         │                          │                          │    các thuộc tính
         │                          │                          │    ẩn
         │                          │                          │
```

Luồng này minh họa cách:

**Lý thuyết Quyền riêng tư → Triển khai Kỹ thuật**

-   **Tối thiểu hóa Dữ liệu** → Lưu trữ thông tin đăng nhập phía khách hàng + Giao thức tiết lộ có chọn lọc + Tạo Zero-Knowledge Proofs (ZKP)
-   **Kiểm soát Người dùng** → Quản lý khóa riêng + Giao diện quản lý đồng ý + Kiểm soát tiết lộ thuộc tính tinh chỉnh
-   **Tin cậy Mật mã** → Sơ đồ chữ ký BBS+ + Khung IOTA Identity + Hoạt động mật mã dựa trên ghép cặp
-   **Xác minh Phi tập trung** → Tích hợp IOTA Tangle + Giao thức phân giải DID + Khả năng xác minh offline

### Điểm Tích hợp

Hệ thống ZKP tích hợp thông qua các giao thức tiêu chuẩn hóa và các điểm tích hợp được định nghĩa rõ ràng:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                         KIẾN TRÚC TÍCH HỢP                                    │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  TÍCH HỢP PHÍA KHÁCH HÀNG                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • Tải module WASM cho hoạt động mật mã                                  │  │
│  │ • Lưu trữ khóa an toàn (enclave bảo mật trình duyệt/di động)            │  │
│  │ • Giao diện người dùng cho kiểm soát đồng ý và tiết lộ                  │  │
│  │ • Lưu trữ và quản lý thông tin đăng nhập cục bộ                         │  │
│  │ • Tương thích đa nền tảng                                               │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  TÍCH HỢP GIAO THỨC MẠNG                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • Giao thức DIDComm cho nhắn tin bảo mật                                │  │
│  │ • HTTPS/WSS cho bảo mật truyền tải                                      │  │
│  │ • Mô hình dữ liệu thông tin đăng nhập có thể xác minh W3C               │  │
│  │ • Triển khai giao thức thử thách-phản hồi                               │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  TÍCH HỢP PHÍA MÁY CHỦ                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • Tích hợp IOTA Identity SDK                                            │  │
│  │ • Xác minh chữ ký BBS+                                                  │  │
│  │ • Phân giải và bộ nhớ đệm DID                                           │  │
│  │ • Quản lý sổ đăng ký thu hồi                                            │  │
│  │ • Kiểm soát quyền riêng tư cổng API                                     │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                    │                                          │
│                                    ▼                                          │
│  TÍCH HỢP HẠ TẦNG                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ • Cấu hình node IOTA Tangle                                             │  │
│  │ • Tích hợp HSM cho quản lý khóa doanh nghiệp                            │  │
│  │ • Điều phối container với chính sách bảo mật                            │  │
│  │ • Giám sát và cảnh báo bảo vệ quyền riêng tư                            │  │
│  │ • Sao lưu và lập kế hoạch khôi phục thảm họa                            │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Triển khai Zero-Knowledge Proofs (ZKP) với IOTA Identity

Tài liệu này giải thích việc triển khai Zero-Knowledge Proofs (ZKP) sử dụng IOTA Identity cho tiết lộ có chọn lọc của thông tin đăng nhập có thể xác minh. Nó bao gồm toàn bộ luồng từ tạo danh tính đến xác minh thông tin đăng nhập, với các ví dụ mã từ triển khai của chúng ta.

## Tổng quan về Hệ sinh thái SSI

Danh tính Tự chủ (SSI) là một mô hình quản lý danh tính số cho phép cá nhân kiểm soát thông tin danh tính của họ mà không cần dựa vào các cơ quan tập trung. Hệ sinh thái SSI bao gồm ba tác nhân chính:

1. **Issuer (Nhà phát hành)**: Tạo và ký thông tin đăng nhập có thể xác minh (ví dụ: trường đại học, chính phủ, nhà tuyển dụng)
2. **Holder (Người giữ)**: Nhận thông tin đăng nhập từ nhà phát hành và tạo bằng chứng cho người xác minh
3. **Verifier (Người xác minh)**: Xác thực bằng chứng từ người giữ để xác minh các tuyên bố

### Tam giác Tin cậy W3C

Tam giác Tin cậy W3C đại diện cho mối quan hệ tin cậy giữa ba thực thể này:

```
┌───────────────────┐
│      ISSUER       │
│                   │
│ - Tạo và          │
│   ký VCs          │
│ - Xuất bản Tài    │
│   liệu DID        │
└─────────┬─────────┘
          │
     1. Phát hành
   Thông tin đăng nhập
      với chữ ký
          │
          ▼
┌───────────────────┐         ┌───────────────────┐
│      HOLDER       │         │     VERIFIER      │
│                   │    2.   │                   │
│ - Lưu trữ VCs     │ Trình   │ - Xác thực        │
│ - Kiểm soát       │ bày Dữ  │  bằng chứng       │
│   tiết lộ         │ liệu Có │ - Kiểm tra chữ ký │
│ - Tạo             │ chọn lọc│   nhà phát hành   │
│   bằng chứng      │ ──────> │ - Tin tưởng       │
└───────────────────┘         └─────────┬─────────┘
          ▲                             │
          │                             │
          │                             │
          └─────────────────────────────┘
                3. Mối quan hệ Tin cậy
                   (Trực tiếp tùy chọn)
```

Tam giác tin cậy minh họa cách:

1. **Issuer → Holder**: Nhà phát hành tạo thông tin đăng nhập chứa các tuyên bố về người giữ và ký mật mã.
2. **Holder → Verifier**: Người giữ trình bày thông tin có chọn lọc từ thông tin đăng nhập của họ cho người xác minh.
3. **Verifier → Issuer**: Người xác minh tin tưởng vào những chứng thực của nhà phát hành bằng cách xác thực chữ ký của họ.

### Decentralized Identifiers (DIDs)

Decentralized Identifiers (DIDs) là thành phần cơ bản của SSI. Chúng là:

-   **Định danh duy nhất toàn cầu** không yêu cầu sổ đăng ký tập trung
-   **Kiên trì** và không thay đổi theo thời gian
-   **Có thể phân giải** thành tài liệu DID chứa phương thức xác minh
-   **Có thể xác minh mật mã** và được kiểm soát bởi chủ thể DID

DID trông như thế này:

```
did:iota:0x123456789abcdef...
  ^    ^         ^
  |    |         |
Phương Định danh  Định danh cụ thể theo phương thức
thức   cụ thể     (chuỗi ID duy nhất)
       theo phương thức
       (blockchain/sổ cái)
```

Trong khung IOTA Identity, DIDs được lưu trữ trên IOTA Tangle (sổ cái phân tán), làm cho chúng bất biến và chống giả mạo.

### Tài liệu DID

Tài liệu DID là tài liệu JSON-LD chứa thông tin liên quan đến DID, bao gồm:

-   **Phương thức Xác minh**: Khóa công khai được sử dụng để xác thực và ủy quyền
-   **Dịch vụ**: Điểm cuối nơi chủ thể DID có thể được liên lạc hoặc tương tác
-   **Phương thức Xác thực**: Tham chiếu đến phương thức xác minh để xác thực
-   **Phương thức Khẳng định**: Tham chiếu đến phương thức xác minh để tạo khẳng định

Ví dụ cấu trúc tài liệu DID:

```json
{
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:iota:0x123456789abcdef...",
    "verificationMethod": [
        {
            "id": "did:iota:0x123456789abcdef...#key-1",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:iota:0x123456789abcdef...",
            "publicKeyMultibase": "z28Kp7P9...DQk"
        },
        {
            "id": "did:iota:0x123456789abcdef...#key-2",
            "type": "BLS12381G2Key2020",
            "controller": "did:iota:0x123456789abcdef...",
            "publicKeyMultibase": "zUC7LTaPw...JWN"
        }
    ],
    "authentication": ["did:iota:0x123456789abcdef...#key-1"],
    "assertionMethod": ["did:iota:0x123456789abcdef...#key-2"],
    "service": [
        {
            "id": "did:iota:0x123456789abcdef...#linked-domain",
            "type": "LinkedDomains",
            "serviceEndpoint": "https://example.com"
        }
    ]
}
```

### Mối quan hệ Khóa Công khai/Riêng tư

Trong mô hình SSI, cặp khóa mật mã là điều cần thiết:

1. **Khóa Riêng tư**:

    - Được lưu trữ an toàn bởi thực thể (không bao giờ chia sẻ)
    - Được sử dụng để ký thông tin đăng nhập, bằng chứng và hoạt động DID
    - Chỉ được kiểm soát bởi chủ thể DID
    - Có thể được xoay và thu hồi nếu bị xâm phạm

2. **Khóa Công khai**:
    - Được xuất bản trong Tài liệu DID
    - Được sử dụng bởi người khác để xác minh chữ ký
    - Các loại khác nhau cho các mục đích khác nhau (xác thực, khẳng định, v.v.)
    - Có thể được liên kết với các phương thức xác minh khác nhau

Các loại khóa trong triển khai của chúng ta:

-   **Ed25519**: Ký nhanh, an toàn cho hoạt động chung
-   **BLS12381**: Cho phép hoạt động mật mã nâng cao cần thiết cho ZKPs và tiết lộ có chọn lọc

Mối quan hệ trông như thế này:

```
┌───────────────┐              ┌────────────────┐
│  Private Key  │              │  Public Key    │
│ (lưu trữ      │  tạo ra      │ (xuất bản trong│
│  an toàn)     │─────────────>│  Tài liệu DID) │
└───────────────┘              └────────────────┘
        │                              │
        │                              │
        ▼                              ▼
┌───────────────┐              ┌───────────────┐
│       Ký      │              │    Xác minh   │
│  Credential   │              │   Credential  │
└───────────────┘              └───────────────┘
```

### Vị trí ZKP trong Mô hình SSI

Zero-Knowledge Proofs (ZKP) là một phương thức mật mã cho phép một bên chứng minh họ biết một giá trị mà không tiết lộ chính giá trị đó. Trong hệ sinh thái Danh tính Tự chủ (SSI), ZKP cho phép **tiết lộ có chọn lọc** - một tính năng bảo vệ quyền riêng tư quan trọng cho phép người giữ chỉ tiết lộ các phần cụ thể của thông tin đăng nhập của họ trong khi giữ các phần khác bí mật.

#### Vấn đề ZKPs Giải quyết trong SSI

Chữ ký số truyền thống có tính chất "tất cả hoặc không có gì" - hoặc bạn hiển thị toàn bộ tài liệu đã ký hoặc bạn không thể xác minh chữ ký. Điều này tạo ra vấn đề quyền riêng tư trong SSI, nơi thông tin đăng nhập thường chứa nhiều thông tin hơn cần thiết cho một kịch bản xác minh cụ thể.

Ví dụ, thông tin đăng nhập bằng cấp đại học có thể bao gồm:

-   Họ tên đầy đủ
-   Ngày sinh
-   Loại bằng cấp
-   Ngày tốt nghiệp
-   GPA
-   ID sinh viên
-   Các môn học đã hoàn thành

Đối với nhiều kịch bản xác minh, chỉ một tập con của thông tin này là cần thiết (ví dụ: chỉ chứng minh bạn có bằng cấp mà không tiết lộ GPA của bạn).

#### Cách Chữ ký BBS+ Cho phép ZKPs

Khung IOTA Identity sử dụng chữ ký BBS+, có các tính chất chính sau:

1. **Ký nhiều thông điệp**: Có thể ký nhiều thuộc tính độc lập trong một thông tin đăng nhập duy nhất
2. **Tiết lộ có chọn lọc**: Có thể tạo bằng chứng chỉ tiết lộ các thuộc tính đã chọn
3. **Không kiến thức**: Có thể chứng minh kiến thức về các thuộc tính ẩn mà không tiết lộ chúng
4. **Không thể liên kết**: Các bằng chứng được tạo từ cùng một thông tin đăng nhập không thể liên kết

Các tính chất toán học của chữ ký BBS+ dựa trên đường cong elliptic thân thiện với ghép cặp (cụ thể là BLS12-381) và bao gồm:

-   Sơ đồ cam kết
-   Ghép cặp song tuyến tính
-   Các phép biến đổi toán học bảo tồn tính chất xác minh

#### Điểm Tích hợp ZKP trong Luồng SSI

1. **Trong quá trình Phát hành Thông tin đăng nhập**:

    - Nhà phát hành phải sử dụng thuật toán BLS12381_SHA256 để tạo phương thức xác minh
    - Thông tin đăng nhập được cấu trúc thành một tập hợp các tuyên bố riêng biệt có thể được tiết lộ hoặc che giấu riêng lẻ
    - Mỗi thuộc tính trong thông tin đăng nhập được mã hóa riêng biệt trong quá trình ký
    - Chữ ký ràng buộc tất cả các thuộc tính lại với nhau bằng mật mã

2. **Trong quá trình Lưu trữ Thông tin đăng nhập**:

    - Người giữ lưu trữ thông tin đăng nhập hoàn chỉnh với tất cả các thuộc tính
    - Người giữ cũng lưu trữ tài liệu mật mã cần thiết để tạo tiết lộ có chọn lọc sau này
    - Không cần xử lý đặc biệt ở giai đoạn này

3. **Giữa Người giữ và Người xác minh**:

    - Khi người giữ nhận được yêu cầu bằng chứng từ người xác minh, họ có thể:
        - Quyết định tuyên bố nào sẽ tiết lộ và tuyên bố nào sẽ che giấu bằng phương thức `concealInSubject()`
        - Tạo bằng chứng tiết lộ có chọn lọc chứa:
            - Các thuộc tính được tiết lộ dưới dạng văn bản rõ ràng
            - Các thuộc tính ẩn như giá trị "null"
            - Bằng chứng mật mã rằng các thuộc tính ẩn là một phần của thông tin đăng nhập đã ký gốc
        - Bao gồm phản hồi cho thử thách của người xác minh để ngăn chặn các cuộc tấn công phát lại

4. **Trong quá trình Xác minh**:
    - Người xác minh có thể xác minh mật mã rằng:
        - Tất cả các tuyên bố (cả được tiết lộ và che giấu) là một phần của thông tin đăng nhập gốc
        - Chữ ký của nhà phát hành hợp lệ trên toàn bộ thông tin đăng nhập
        - Người giữ không giả mạo bất kỳ thông tin nào
        - Thử thách được kết hợp đúng cách trong bằng chứng
        - Tất cả điều này mà không thấy các tuyên bố bị che giấu!

#### Khả năng ZKP trong IOTA Identity

Triển khai ZKP của khung IOTA Identity cung cấp một số tính năng nâng cao:

1. **Tiết lộ có chọn lọc tinh chỉnh**:

    - Chọn các trường cụ thể trong thông tin đăng nhập (ví dụ: `"name"`)
    - Chọn các thuộc tính lồng nhau (ví dụ: `"degree.type"`)
    - Chọn các phần tử mảng cụ thể (ví dụ: `"mainCourses[0]"`)

2. **Bằng chứng vị từ** (tính năng dự kiến):

    - Chứng minh các câu lệnh về thuộc tính mà không tiết lộ chúng
    - Ví dụ: "Tuổi trên 21", "GPA trên 3.0", "Lương trong khoảng X-Y"

3. **Bằng chứng đa thông tin đăng nhập** (tính năng dự kiến):
    - Tạo bằng chứng trải rộng trên nhiều thông tin đăng nhập
    - Ví dụ: Chứng minh bạn có bằng cấp VÀ bằng lái xe mà không tiết lộ tất cả chi tiết

Biểu đồ này minh họa vị trí ZKP trong luồng SSI:

```
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐
│  NHÀ PHÁT HÀNH  │        │   NGƯỜI GIỮ     │       │  NGƯỜI XÁC MINH │
└────────┬────────┘        └────────┬────────┘       └────────┬────────┘
         │                          │                          │         
         │ 1. Tạo                   │                          │
         │ thông tin đăng nhập với  │                          │
         │ chữ ký BBS+(ZKP sẵn sàng)│                          │
         │                          │                          │
         │ 2. Phát hành thông tin   │                          │
         │ đăng nhập                │                          │
         │────────────────────────> │                          │
         │                          │                          │
         │                          │ 3. Lưu trữ thông tin     │
         │                          │ đăng nhập                │
         │                          │                          │
         │                          │ <─────────────────────── │
         │                          │ 4. Yêu cầu bằng chứng với│
         │                          │    thử thách             │
         │                          │                          │
         │                          │ 5. Tạo ZKP với           │
         │                          │    tiết lộ có chọn lọc   │
         │                          │    (ĐÂY LÀ NƠI ZKP       │
         │                          │     XẢY RA!)             │
         │                          │                          │
         │                          │ 6. Gửi bằng chứng        │
         │                          │    với ZKP               │
         │                          │ ────────────────────────>│
         │                          │                          │
         │                          │                          │ 7. Xác minh ZKP
         │                          │                          │    mà không thấy
         │                          │                          │    các thuộc tính
         │                          │                          │    ẩn
         │                          │                          │
```

## Bước 1: Tạo Danh tính Nhà phát hành

Nhà phát hành tạo danh tính với phương thức xác minh có khả năng chữ ký BBS+, cho phép tiết lộ có chọn lọc.

```typescript
// Tạo client để kết nối với mạng IOTA
const iotaClient = new IotaClient({ url: NETWORK_URL })
const network = await iotaClient.getChainIdentifier()

// Tạo lưu trữ cho khóa của nhà phát hành
const issuerStorage = getMemstorage()

// Lấy client đã được cấp vốn
const issuerClient = await getFundedClient(issuerStorage)

// Tạo tài liệu nhà phát hành chưa xuất bản
const unpublishedIssuerDocument = new IotaDocument(network)

// Tạo phương thức xác minh với BLS cho chữ ký BBS+
const issuerFragment = await unpublishedIssuerDocument.generateMethodJwp(
    issuerStorage,
    ProofAlgorithm.BLS12381_SHA256,
    undefined,
    MethodScope.VerificationMethod()
)

// Xuất bản danh tính nhà phát hành lên mạng
const { output: issuerIdentity } = await issuerClient
    .createIdentity(unpublishedIssuerDocument)
    .finish()
    .buildAndExecute(issuerClient)
const issuerDocument = issuerIdentity.didDocument()
```

## Bước 2: Tạo và Ký Thông tin đăng nhập

Nhà phát hành tạo thông tin đăng nhập với dữ liệu chủ thể và ký nó bằng chữ ký BBS+.

```typescript
// Tạo chủ thể thông tin đăng nhập
const subject = {
    name: "Hứa Văn Lý",
    mainCourses: ["Software Engineering", "System Modeling"],
    degree: {
        type: "BachelorDegree",
        name: "Bachelor of Software Engineering",
    },
    GPA: 3.34,
}

// Xây dựng thông tin đăng nhập bằng chủ thể và nhà phát hành
const credential = new Credential({
    id: "https:/uit.edu.vn/credentials/3732",
    issuer: issuerDocument.id(),
    type: "UniversityDegreeCredential",
    credentialSubject: subject,
})

// Tạo thông tin đăng nhập JPT với chữ ký BBS+
const credentialJpt = await issuerDocument.createCredentialJpt(
    credential,
    issuerStorage,
    issuerFragment,
    new JwpCredentialOptions()
)

// Xác thực bằng chứng của thông tin đăng nhập
const decodedJpt = JptCredentialValidator.validate(
    credentialJpt,
    issuerDocument,
    new JptCredentialValidationOptions(),
    FailFast.FirstError
)
```

JWT thông tin đăng nhập (JPT) là token có cấu trúc với ba phần:

-   Header: Chứa thông tin thuật toán và metadata tuyên bố
-   Payload: Chứa dữ liệu thông tin đăng nhập thực tế
-   Signature: Bằng chứng mật mã về tính xác thực của thông tin đăng nhập

Ví dụ về payload thông tin đăng nhập JWT:

```json
{
    "iss": "did:iota:0x123456789abcdef...",
    "sub": "did:subject:holder123",
    "iat": 1628097029,
    "exp": 1659633029,
    "vc": {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": ["VerifiableCredential", "UniversityDegreeCredential"],
        "credentialSubject": {
            "name": "Hứa Văn Lý",
            "mainCourses": ["Software Engineering", "System Modeling"],
            "degree": {
                "type": "BachelorDegree",
                "name": "Bachelor of Software Engineering"
            },
            "GPA": 3.34
        }
    }
}
```

-   Header: Chứa thông tin thuật toán và metadata tuyên bố
-   Payload: Chứa dữ liệu thông tin đăng nhập thực tế
-   Signature: Bằng chứng mật mã về tính xác thực của thông tin đăng nhập

## Bước 3: Nhà phát hành Gửi Thông tin đăng nhập cho Người giữ

Trong hệ thống thực tế, nhà phát hành sẽ truyền tải an toàn thông tin đăng nhập cho người giữ:

```typescript
// Trong hệ thống thực tế, điều này sẽ bao gồm truyền tải an toàn
// Ở đây chúng ta chỉ đơn giản truyền chuỗi JWT thông tin đăng nhập
const credentialJptString = credentialJpt.toString()
// Truyền credentialJptString cho người giữ...
```

Payload JWT trông như thế này:

```
eyJ0eXAiOiJKUFQiLCJhbGciOiJCQlMtQkxTMTIzODEtU0hBMjU2Iiwia2lkIjoiZGlkOmlvdGE6...
```

## Bước 4: Người giữ Phân giải DID của Nhà phát hành và Xác thực Thông tin đăng nhập

Người giữ cần phân giải DID của nhà phát hành để lấy khóa công khai của họ để xác thực:

```typescript
// Tạo identity client để phân giải DIDs
const identityClientReadOnly = await IdentityClientReadOnly.createWithPkgId(
    iotaClient,
    IOTA_IDENTITY_PKG_ID
)

// Trích xuất DID nhà phát hành từ thông tin đăng nhập
let issuerDid = IotaDID.parse(
    JptCredentialValidatorUtils.extractIssuerFromIssuedJpt(
        credentialJpt
    ).toString()
)

// Phân giải DID của nhà phát hành để lấy tài liệu DID của họ
let issuerDoc = await identityClientReadOnly.resolveDid(issuerDid)

// Xác thực thông tin đăng nhập
let decodedCredential = JptCredentialValidator.validate(
    credentialJpt,
    issuerDoc,
    new JptCredentialValidationOptions(),
    FailFast.FirstError
)
```

## Bước 5: Người xác minh Gửi Thử thách cho Bằng chứng

Người xác minh tạo thử thách duy nhất, ngẫu nhiên mà người giữ phải kết hợp vào bằng chứng của họ. Đây là cơ chế bảo mật quan trọng để ngăn chặn các cuộc tấn công phát lại:

```typescript
// Tạo thử thách ngẫu nhiên
const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440"
```

## Bước 6: Người giữ Tạo Bằng chứng Tiết lộ Có chọn lọc

Người giữ quyết định trường nào sẽ che giấu và trường nào sẽ tiết lộ:

```typescript
// Lấy method ID từ thông tin đăng nhập để tham chiếu phương thức xác minh
const methodId = decodedCredential.decodedJwp().getIssuerProtectedHeader().kid!

// Tạo bằng chứng tiết lộ có chọn lọc từ thông tin đăng nhập
const selectiveDisclosurePresentation = new SelectiveDisclosurePresentation(
    decodedCredential.decodedJwp()
)

// Che giấu các trường cụ thể - đây là cốt lõi của ZKP!
selectiveDisclosurePresentation.concealInSubject("mainCourses[1]")
selectiveDisclosurePresentation.concealInSubject("degree.name")
```

## Bước 7: Người giữ Tạo JWT Bằng chứng

Người giữ tạo JWT bằng chứng với tiết lộ có chọn lọc và thử thách:

```typescript
// Thiết lập tùy chọn bằng chứng với thử thách
const presentationOptions = new JwpPresentationOptions()
presentationOptions.nonce = challenge

// Tạo JWT bằng chứng
const presentationJpt = await issuerDoc.createPresentationJpt(
    selectiveDisclosurePresentation,
    methodId,
    presentationOptions
)
```

## Bước 8: Người giữ Gửi Bằng chứng cho Người xác minh

Người giữ gửi bằng chứng cho người xác minh:

```typescript
// Trong hệ thống thực tế, điều này sẽ bao gồm truyền tải an toàn
// Ở đây chúng ta chỉ truyền chuỗi JWT bằng chứng
const presentationJptString = presentationJpt.toString()
// Truyền presentationJptString cho người xác minh...
```

Khi được giải mã, payload JWT bằng chứng trông như sau:

```json
{
    "payloads": [
        "ImRpZDppb3RhOmNiY2Y4ZDM1OjB4Yzc0MTAzNjIzN2JiYWZhM2VmYjcwMGJmNmJkZDQ5OTBhOGRlMzZjNWVkNDdkNTFhYTVhNzQwYmMwMDFkNGRlZiI",
        null,
        null,
        "Imh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIg",
        "IlZlcmlmaWFibGVDcmVkZW50aWFsIg",
        "IlVuaXZlcnNpdHlEZWdyZWVDcmVkZW50aWFsIg",
        "My4zNA",
        "IkJhY2hlbG9yRGVncmVlIg",
        null,
        "IlNvZnR3YXJlIEVuZ2luZWVyaW5nIg",
        null,
        "IkhydeG4nVsSDbiBMw70i"
    ],
    "issuer": "eyJ0eXAiOiJKUFQiLCJhbGci...",
    "proof": "eyJhbGciOiJCQlMtQkxTMTIzOD...",
    "presentation": "eyJub25jZSI6IjQ3NWE3OTg..."
}
```

### Các Thành phần Chính của Bằng chứng

1. **payloads**:

    - Đây là định dạng mảng khác với thông tin đăng nhập JSON gốc vì chữ ký BBS+ xử lý từng thuộc tính riêng biệt.
    - Mỗi chuỗi là giá trị được mã hóa Base64URL, được bọc trong dấu ngoặc kép JSON, sau đó được mã hóa Base64URL lần nữa. Việc mã hóa kép này là yêu cầu kỹ thuật cho triển khai BBS+ của thư viện IOTA Identity.
    - Các giá trị null đại diện cho các thuộc tính bị che giấu.

2. **issuer**: Chứa thông tin về tài liệu DID của nhà phát hành. Điều này được người xác minh sử dụng để xác định vị trí khóa công khai cần thiết để xác minh chữ ký.

3. **proof**: Bằng chứng chữ ký BBS+ mật mã xác nhận tính xác thực của thông tin đăng nhập. Nó chứng minh toán học rằng ngay cả các trường ẩn cũng là một phần của thông tin đăng nhập được ký gốc.

4. **presentation**: Chứa dữ liệu phản hồi thử thách, chứng minh bằng chứng này được tạo đặc biệt cho yêu cầu xác minh này. Điều này ngăn chặn các cuộc tấn công phát lại.

### Tại sao có Định dạng Mã hóa Khác nhau?

-   Thông tin đăng nhập gốc sử dụng định dạng JSON (dễ đọc hơn cho con người)
-   Thuật toán BBS+ yêu cầu xử lý từng thuộc tính riêng biệt để cho phép tiết lộ có chọn lọc
-   Mảng payloads sử dụng định dạng mã hóa chuyên biệt được yêu cầu bởi thư viện mật mã
-   Việc mã hóa kép xảy ra vì:
    1. Mã hóa đầu tiên: Mỗi giá trị được mã hóa để duy trì biểu diễn nhị phân nhất quán
    2. Mã hóa thứ hai: Các giá trị được mã hóa được xử lý bởi thuật toán BBS+, xuất ra các giá trị được mã hóa Base64

Định dạng chuyên biệt này cho phép bằng chứng mật mã hoạt động đúng cách ngay cả khi một số trường bị che giấu.

## Bước 9: Người xác minh Xác thực Bằng chứng

Người xác minh giải quyết DID của nhà phát hành và xác thực bằng chứng:

```typescript
// Trích xuất DID nhà phát hành từ bằng chứng
const issuerDidV = IotaDID.parse(
    JptPresentationValidatorUtils.extractIssuerFromPresentedJpt(
        presentationJpt
    ).toString()
)

// Giải quyết DID của nhà phát hành để có tài liệu DID của họ
const issuerDocV = await identityClientReadOnly.resolveDid(issuerDidV)

// Thiết lập tùy chọn xác thực với thử thách
const presentationValidationOptions = new JptPresentationValidationOptions({
    nonce: challenge,
})

// Xác thực bằng chứng
const decodedPresentedCredential = JptPresentationValidator.validate(
    presentationJpt,
    issuerDocV,
    presentationValidationOptions,
    FailFast.FirstError
)
```

Sau khi xác thực, người xác minh chỉ có thể thấy các trường được tiết lộ:

```json
{
    "name": "Hứa Văn Lý",
    "mainCourses": ["Software Engineering"],
    "degree": {
        "type": "BachelorDegree"
    },
    "GPA": 3.34
}
```

Vẻ đẹp của ZKP là người xác minh có thể xác minh mật mã rằng:

1. Toàn bộ thông tin đăng nhập đã được ký đúng cách bởi nhà phát hành
2. Không có sự giả mạo nào xảy ra với bất kỳ trường nào
3. Thử thách đã được kết hợp đúng cách (ngăn chặn các cuộc tấn công phát lại)

Tất cả điều này trong khi chỉ nhìn thấy các trường mà người giữ đã chọn tiết lộ!
