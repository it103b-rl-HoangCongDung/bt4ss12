const readline = require('readline-sync');

// Khởi tạo danh sách thuê bao ban đầu (Array of Objects)
let subscribers = [
    { id: 'SUB001', name: 'Nguyen Van A', package: 'Standard', price: 200000, debtDate: '2023-10-01', status: 'Active' },
    { id: 'SUB002', name: 'Tran Thi B', package: 'Premium', price: 500000, debtDate: '2024-01-15', status: 'Active' },
    { id: 'SUB003', name: 'Le Van C', package: 'Basic', price: 100000, debtDate: '2023-08-10', status: 'Locked' }
];

const packages = {
    'Basic': 100000,
    'Standard': 200000,
    'Premium': 500000
};

function showMenu() {
    console.log('\n--- HỆ THỐNG QUẢN TRỊ THUÊ BAO RIKKEISTREAM CLI ---');
    console.log('1. Thêm khách hàng mới');
    console.log('2. Tra cứu thuê bao');
    console.log('3. Nâng/Hạ cấp gói cước');
    console.log('4. Khóa thuê bao nợ cước');
    console.log('5. Thống kê doanh thu định kỳ (MRR)');
    console.log('6. Thoát chương trình');
}

function addSubscriber() {
    console.log('\n=== Thêm Khách Hàng Mới ===');
    let id = readline.question('Nhập mã tài khoản (ví dụ SUB004): ');
    let name = readline.question('Nhập tên khách hàng: ');
    let pkg = readline.question('Nhập gói cước (Basic/Standard/Premium): ');
    
    if (!packages[pkg]) {
        console.log('[Lỗi] Mã gói cước không hợp lệ! Thêm mới thất bại.');
        return;
    }
    
    let debtDate = readline.question('Nhập ngày nợ cước (YYYY-MM-DD): ');
    
    subscribers.push({
        id: id,
        name: name,
        package: pkg,
        price: packages[pkg],
        debtDate: debtDate,
        status: 'Active'
    });
    console.log('[Thành công] Đã thêm thuê bao mới.');
}

function searchSubscriber() {
    console.log('\n=== Tra Cứu Thuê Bao ===');
    let keyword = readline.question('Nhập mã tài khoản hoặc tên khách hàng cần tìm: ').toLowerCase();
    let results = subscribers.filter(s => s.id.toLowerCase().includes(keyword) || s.name.toLowerCase().includes(keyword));
    
    if (results.length === 0) {
        console.log('[Thông báo] Không tìm thấy thuê bao phù hợp.');
    } else {
        console.log(`Tìm thấy ${results.length} kết quả:`);
        console.table(results);
    }
}

function updatePackage() {
    console.log('\n=== Nâng/Hạ Cấp Gói Cước ===');
    let id = readline.question('Nhập mã tài khoản cần đổi gói: ');
    let sub = subscribers.find(s => s.id === id);
    
    if (!sub) {
        console.log('[Lỗi] Không tìm thấy mã tài khoản trong hệ thống.');
        return;
    }
    
    let newPkg = readline.question('Nhập gói cước mới (Basic/Standard/Premium): ');
    if (!packages[newPkg]) {
        console.log('[Lỗi] Mã gói mới không tồn tại!');
        return;
    }
    
    sub.package = newPkg;
    sub.price = packages[newPkg];
    console.log('[Thành công] Đã cập nhật gói cước mới cho tài khoản ' + id);
}

function lockDebtSubscribers() {
    console.log('\n=== Kiểm Tra & Khóa Thuê Bao Nợ Cước ===');
    let today = new Date();
    let count = 0;
    
    subscribers.forEach(s => {
        let debt = new Date(s.debtDate);
        let diffTime = Math.abs(today - debt);
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 30 && s.status === 'Active') {
            s.status = 'Locked';
            count++;
            console.log(`- Tài khoản ${s.id} (${s.name}) đã bị khóa do nợ cước ${diffDays} ngày.`);
        }
    });
    
    console.log(`[Hoàn tất] Đã khóa ${count} tài khoản quá hạn nợ cước.`);
}

function calculateMRR() {
    console.log('\n=== Thống Kê Doanh Thu Định Kỳ MRR ===');
    let totalMRR = subscribers
        .filter(s => s.status === 'Active')
        .reduce((sum, s) => sum + s.price, 0);
    
    console.log(`Tổng doanh thu định kỳ hàng tháng (MRR từ thuê bao Active): ${totalMRR.toLocaleString()} VNĐ`);
}

function main() {
    let running = true;
    while (running) {
        showMenu();
        let choice = readline.question('\nChọn chức năng (1-6): ');
        switch (choice) {
            case '1':
                addSubscriber();
                break;
            case '2':
                searchSubscriber();
                break;
            case '3':
                updatePackage();
                break;
            case '4':
                lockDebtSubscribers();
                break;
            case '5':
                calculateMRR();
                break;
            case '6':
                console.log('Đang thoát chương trình. Tạm biệt!');
                running = false;
                break;
            default:
                console.log('[Lỗi] Lựa chọn không hợp lệ. Vui lòng chọn từ 1 đến 6.');
        }
    }
}

main();