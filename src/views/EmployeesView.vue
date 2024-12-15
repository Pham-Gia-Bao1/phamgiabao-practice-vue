<template>
  <div class="container">
    <!-- Form tìm kiếm -->
    <div class="search-form">
      <input type="text" v-model="searchParams.name" placeholder="Tên nhân viên" />
      <input type="date" v-model="searchParams.dobFrom" />
      <input type="date" v-model="searchParams.dobTo" />
      <select v-model="searchParams.gender">
        <option value="">Tất cả</option>
        <option value="MALE">Nam</option>
        <option value="FEMALE">Nữ</option>
      </select>
      <select v-model="searchParams.salaryRange">
        <option value="">Tất cả mức lương</option>
        <option value="lt5">Dưới 5 triệu</option>
        <option value="5-10">5-10 triệu</option>
        <option value="10-20">10-20 triệu</option>
        <option value="gt20">Trên 20 triệu</option>
      </select>
      <button class="btn btn-search" @click="fetchEmployees">Tìm kiếm</button>
    </div>
    <div class="header">
      <h1 class="title">Quản Lý Nhân Viên</h1>
      <button class="btn btn-add" @click="showAddForm">+ Thêm Mới</button>
    </div>
    <div class="table-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Ngày sinh</th>
            <th>Giới tính</th>
            <th>Lương</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="employees.length > 0">
            <tr v-for="(employee, index) in employees" :key="employee.id">
              <td>{{ index + 1 }}</td>
              <td>{{ employee.name }}</td>
              <td>{{ formatDate(employee.dob) }}</td>
              <td>{{ employee.gender === 'MALE' ? 'Nam' : 'Nữ' }}</td>
              <td>{{ formatCurrency(employee.salary) }}</td>
              <td>
                <button class="btn btn-primary" @click="showUpdateForm(employee)">Cập nhật</button>
                <button class="btn btn-danger" @click="deleteEmployee(employee.id)">Xóa</button>
                <button class="btn btn-info" @click="showDetails(employee)">Xem chi tiết</button>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="6" class="no-data">Không tìm thấy nhân viên</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Form thêm/sửa -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h3>{{ formMode === 'add' ? 'Thêm Nhân Viên' : 'Cập Nhật Nhân Viên' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Tên:</label>
            <input type="text" v-model="formData.name" required />
          </div>
          <div class="form-group">
            <label>Ngày sinh:</label>
            <input type="date" v-model="formData.dob" required />
          </div>
          <div class="form-group">
            <label>Giới tính:</label>
            <select v-model="formData.gender" required>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
            </select>
          </div>
          <div class="form-group">
            <label>Lương:</label>
            <input type="number" v-model="formData.salary" required />
          </div>
          <div class="form-buttons">
            <button class="btn btn-primary" type="submit">
              {{ formMode === 'add' ? 'Thêm' : 'Cập nhật' }}
            </button>
            <button class="btn btn-secondary" @click="closeForm">Hủy</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Modal chi tiết -->
    <div v-if="showDetailModal" class="modal">
      <div class="modal-content">
        <h3>Thông Tin Chi Tiết</h3>
        <p><strong>Tên:</strong> {{ selectedEmployee.name }}</p>
        <p><strong>Ngày sinh:</strong> {{ formatDate(selectedEmployee.dob) }}</p>
        <p><strong>Giới tính:</strong> {{ selectedEmployee.gender === 'MALE' ? 'Nam' : 'Nữ' }}</p>
        <p><strong>Lương:</strong> {{ formatCurrency(selectedEmployee.salary) }}</p>
        <button class="btn btn-secondary" @click="closeDetailModal">Đóng</button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      employees: [],
      showForm: false,
      formMode: 'add',
      formData: {
        id: '',
        name: '',
        dob: '',
        gender: 'MALE',
        salary: 0,
      },
      searchParams: {
        name: '',
        dobFrom: '',
        dobTo: '',
        gender: '',
        salaryRange: '',
      },
      showDetailModal: false,
      selectedEmployee: {},
    }
  },
  methods: {
    async fetchEmployees() {
      try {
        const { name, dobFrom, dobTo, gender, salaryRange } = this.searchParams
        const response = await axios.get('http://localhost:8080/api/employees', {
          params: {
            name,
            dobFrom,
            dobTo,
            gender,
            salaryRange,
          },
        })
        this.employees = response.data.data
      } catch (error) {
        console.error(error)
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN')
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    },
    showAddForm() {
      this.formMode = 'add'
      this.formData = { id: '', name: '', dob: '', gender: 'MALE', salary: 0 }
      this.showForm = true
    },
    showUpdateForm(employee) {
      this.formMode = 'update'
      this.formData = { ...employee }
      this.showForm = true
    },
    async handleSubmit() {
      try {
        if (this.formMode === 'add') {
          await axios.post('http://localhost:8080/api/employees', this.formData)
        } else if (this.formMode === 'update') {
          await axios.put(`http://localhost:8080/api/employees/${this.formData.id}`, this.formData)
        }
        this.closeForm()
        this.fetchEmployees()
      } catch (error) {
        console.error(error)
      }
    },
    async deleteEmployee(id) {
      try {
        if (confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
          await axios.delete(`http://localhost:8080/api/employees/${id}`)
          this.fetchEmployees()
        }
      } catch (error) {
        console.error(error)
      }
    },
    showDetails(employee) {
      this.selectedEmployee = employee
      this.showDetailModal = true
    },
    closeDetailModal() {
      this.showDetailModal = false
    },
    closeForm() {
      this.showForm = false
    },
  },
  mounted() {
    this.fetchEmployees()
  },
}
</script>
<style scoped>
.container {
  max-width: 95%;
  margin: 30px auto;
  padding: 20px;
  background-color: #f9f9f9;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.title {
  font-size: 2rem;
  color: #333;
}
.btn-add {
  background-color: #28a745;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-add:hover {
  background-color: #218838;
}
.table-container {
  overflow-x: auto;
}
.styled-table {
  width: 100%;
  border-collapse: collapse;
}
.styled-table thead {
  background-color: #007bff;
  color: #fff;
}
.styled-table th,
.styled-table td {
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
}
.styled-table tbody tr:nth-child(even) {
  background-color: #f3f3f3;
}
.styled-table tbody tr:hover {
  background-color: #f1f1f1;
}
.btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: #fff;
}
.btn-danger {
  background-color: #dc3545;
  color: #fff;
}
.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}
.btn-info {
  background-color: #17a2b8;
  color: #fff;
}
.btn-info:hover {
  background-color: #138496;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 400px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
/* Container form tìm kiếm */
.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
}
/* Input chung và select */
.search-form input,
.search-form select {
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  transition: all 0.3s ease-in-out;
}
.search-form input:focus,
.search-form select:focus {
  border-color: #409eff;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.6);
}
/* Nút tìm kiếm */
.btn-search {
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: #409eff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.3s ease-in-out,
    transform 0.2s ease-in-out;
}
.btn-search:hover {
  background-color: #337ecc;
  transform: scale(1.05);
}
.btn-search:active {
  background-color: #295bb3;
  transform: scale(0.95);
}
/* Responsive */
@media (max-width: 768px) {
  .search-form {
    flex-direction: column;
  }
  .search-form input,
  .search-form select,
  .btn-search {
    width: 100%;
  }
}
</style>
