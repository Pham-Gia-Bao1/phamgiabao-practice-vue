<template>
  <div class="calculator">
    <h1>Simple Calculator</h1>
    <form @submit.prevent="calculate" class="calculator-form">
      <div class="form-group">
        <label for="firstNumber">First Number:</label>
        <input
          type="text"
          id="firstNumber"
          v-model="firstNumber"
          placeholder="Enter first number"
        />
      </div>
      <div class="form-group">
        <label for="secondNumber">Second Number:</label>
        <input
          type="text"
          id="secondNumber"
          v-model="secondNumber"
          placeholder="Enter second number"
        />
      </div>
      <div class="form-group">
        <label for="operator">Operator:</label>
        <select id="operator" v-model="operator">
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
        </select>
      </div>
      <button type="submit" class="btn-submit">Calculate</button>
    </form>
    <div v-if="result !== null" class="result">
      <h2>Result: {{ result }}</h2>
    </div>
    <div v-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      firstNumber: "",
      secondNumber: "",
      operator: "+",
      result: null,
      error: null,
    };
  },
  methods: {
    async calculate() {
      try {
        const response = await axios.post("http://localhost:8080/api/calculator", null, {
          params: {
            firstNumber: this.firstNumber,
            secondNumber: this.secondNumber,
            operator: this.operator,
          },
        });
        this.result = response.data.result;
        this.error = null;
      } catch (error) {
        this.result = null;
        this.error = error.response?.data?.error || "An error occurred";
      }
    },
  },
};
</script>
<style scoped>
/* General Styles */
.calculator {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
  text-align: center;
}
h1 {
  margin-bottom: 20px;
  color: #333;
}
/* Form Styles */
.calculator-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}
label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}
input,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}
input:focus,
select:focus {
  border-color: #ff9800;
}
/* Button Styles */
.btn-submit {
  padding: 10px 15px;
  background-color: #ff9800;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-submit:hover {
  background-color: #e68900;
}
/* Result and Error Styles */
.result {
  margin-top: 20px;
  padding: 10px;
  background-color: #e0f7fa;
  border: 1px solid #00acc1;
  border-radius: 4px;
  color: #00796b;
  font-weight: bold;
}
.error {
  margin-top: 20px;
  padding: 10px;
  background-color: #ffebee;
  border: 1px solid #e57373;
  border-radius: 4px;
  color: #c62828;
  font-weight: bold;
}
</style>
