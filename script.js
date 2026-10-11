let elementsData = [];
const grid = document.getElementById('periodic-grid');
const modal = document.getElementById('element-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.getElementById('close-modal');
const searchInput = document.getElementById('search-input');

// 1. Tự động tải dữ liệu chuẩn 118 nguyên tố từ kho lưu trữ GitHub công khai
async function fetchPeriodicTableData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json');
        const data = await response.json();
        elementsData = data.elements;
        renderTable(elementsData);
    } catch (error) {
        console.error('Không thể tải dữ liệu bảng tuần hoàn:', error);
        grid.innerHTML = '<p style="grid-column: span 18; color: #f85149;">Lỗi kết nối khi tải dữ liệu 118 nguyên tố từ máy chủ!</p>';
    }
}

// 2. Vẽ bảng tuần hoàn lên giao diện
function renderTable(data) {
    grid.innerHTML = '';
    data.forEach(el => {
        const card = document.createElement('div');
        card.classList.add('element-card');
        
        // Gán thuộc tính loại để CSS tự tô màu nhóm hóa học
        if (el.category) {
            card.setAttribute('data-category', el.category);
        }

        // Đặt vị trí cột (xpos) và hàng (ypos) theo chuẩn bảng tuần hoàn
        card.style.gridColumn = el.xpos;
        card.style.gridRow = el.ypos;

        card.innerHTML = `
            <span class="atomic-number">${el.number}</span>
            <span class="symbol">${el.symbol}</span>
            <span class="name">${el.name}</span>
        `;

        // Bấm vào ô để mở bảng thông tin chi tiết
        card.addEventListener('click', () => showModal(el));
        grid.appendChild(card);
    });
}

// 3. Hiển thị thông tin chi tiết trong Modal
function showModal(el) {
    modalBody.innerHTML = `
        <h2>${el.name} (${el.symbol})</h2>
        <p><strong>Số hiệu nguyên tử (Z):</strong> ${el.number}</p>
        <p><strong>Khối lượng nguyên tử:</strong> ${el.atomic_mass ? el.atomic_mass : 'Không rõ'}</p>
        <p><strong>Phân loại:</strong> ${el.category || 'N/A'}</p>
        <p><strong>Vị trí:</strong> Nhóm ${el.xpos}, Chu kỳ ${el.ypos}</p>
        <p><strong>Cấu hình electron:</strong> ${el.electron_configuration || 'Đang cập nhật'}</p>
        <p><strong>Mô tả:</strong> ${el.summary || 'Chưa có thông tin mô tả chi tiết cho nguyên tố này.'}</p>
    `;
    modal.classList.remove('hidden');
}

// Sự kiện đóng mở Modal
closeModal.addEventListener('click', () => modal.classList.add('hidden'));
window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });

// 4. Tính năng tìm kiếm động toàn bộ 118 nguyên tố
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    const filtered = elementsData.filter(el => 
        el.name.toLowerCase().includes(keyword) || 
        el.symbol.toLowerCase().includes(keyword) ||
        el.number.toString().includes(keyword)
    );
    renderTable(filtered);
});

// Kích hoạt chương trình chạy khi mở trang
fetchPeriodicTableData();