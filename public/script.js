function submitTimeIn() {
    const form = document.getElementById('timeInForm');
    const formData = new FormData(form);

    fetch('http://localhost:3000/attendance/timein', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Time In recorded successfully');
            // Reset form if needed
            form.reset();
            // Panggil fungsi untuk memperbarui tabel data attendance setelah merekam Time In
            fetchAttendanceData();
        } else {
            alert('Error recording Time In. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

// Fungsi untuk memperbarui tabel data attendance
function fetchAttendanceData() {
    // Dapatkan elemen tbody untuk tabel attendance
    const tbody = document.getElementById('attendanceTableBody');

    // Bersihkan isi tbody sebelum memuat data baru
    tbody.innerHTML = '';

    function filterAttendance() {
        const filterUserId = document.getElementById('filterUserId').value;
    
        fetch(`http://localhost:3000/attendance/user/${filterUserId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Tampilkan data dalam tabel
                    displayAttendanceData(data.attendance);
                } else {
                    alert('Error fetching attendance. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            });
    }


    // Kirim permintaan ke server untuk mendapatkan data attendance
    fetch('http://localhost:3000/attendance/')
        .then(response => response.json())
        .then(data => {
            // Iterasi melalui data attendance dan tambahkan baris baru ke tbody
            data.attendance.forEach(attendance => {
                const row = tbody.insertRow();
                row.insertCell(0).textContent = attendance.attendance_id;
                row.insertCell(1).textContent = attendance.user_id;
                row.insertCell(2).textContent = attendance.date_attended;
                row.insertCell(3).textContent = attendance.time_in;
                row.insertCell(4).textContent = attendance.time_out;
                row.insertCell(5).textContent = attendance.latitude;
                row.insertCell(6).textContent = attendance.longitude;
                row.insertCell(7).textContent = attendance.photo_url;
            });
        })
        .catch(error => {
            console.error('Error fetching attendance:', error);
            alert('An error occurred while fetching attendance data.');
        });
}

// ...

// Fungsi untuk memperbarui tabel data attendance berdasarkan user_id
function filterAttendance() {
    const filterUserId = document.getElementById('filterUserId').value;

    fetch(`http://localhost:3000/attendance/user/${filterUserId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Tampilkan data dalam tabel
                displayAttendanceData(data.attendance);
            } else {
                alert('Error fetching attendance. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
}

// ...


// Panggil fungsi untuk memperbarui tabel data attendance saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchAttendanceData);
