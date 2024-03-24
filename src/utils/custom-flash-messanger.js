class CustomFlashMessageUtil {
  data = {};
  constructor() {}
  set(name, value) {
    if (!this.data[name]) {
      const newData = {};
      newData[name] = [value];
      this.data = newData;
    } else {
      this.data[name].push(value);
    }
  }
  get(name) {
    const result = this.data[name];
    this.data = {};
    return result;
  }
}

module.exports = new CustomFlashMessageUtil();
