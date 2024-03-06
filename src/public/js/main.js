async function main() {
  const menu = `
  1. Registratsiya
  // 2. Kirish
  3. Barcha Foydalanuvchilar
  3. Chiqish
  `
  checker: while(true){
    let command = prompt(menu);
    switch(command){
      case '1':{
        await addUser();
        break;
      }
      case '2':{
        await login();
        break;
      }
      case '3':{
        await getAllUsers();
        break;
      }
      case '4':{
        break checker;
      }
    }
  }
}

// function addUser(){

// }

async function addUser() {
  const firstName = await window.prompt("Ismi:");
  const lastName = await window.prompt("Familyasi:");
  let age = await window.prompt("Yoshi:");
  while (isNaN(age)) {
    age = await window.prompt("(raqamlarda) Yoshi:");
  }
  const username = await window.prompt("Login:");
  let password = await window.prompt(
    "Diqqat parol 6 ta belgidan kam bo'lmasin\nParol:"
  );
  let password2 = await window.prompt("Parolni qaytaring:");
  while (password !== password2) {
    password = await window.prompt(
      "!!!Parollar mos kelmadi qayta kiriting\nParol:"
    );
    password2 = await window.prompt("Parolni qaytaring:");
    while (password.length > 5) {
      password2 = await window.prompt(
        "Paroldagi beldilar soni 6 tadan kam!\nParolni qaytaring:"
      );
    }
  }

  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      username,
      password,
      age: Number(age),
    }), // Collect form data
  };
  fetch("http://localhost:3000/auth/register", options)
    .then((response) => response.text()) // Read response as text
    .then((data) => {
      /*console.log(data)*/
    });
}

async function getAllUsers() {
  const users = JSON.parse(
    await fetch("http://localhost:3000/users").then((response) =>
      response.text()
    )
  );
  let msg = "";
  users.forEach(
    (el, i) =>
      (msg += `${i + 1} - ${el.firstName} ${el.lastName}\n ${
        el.age
      } yoshda\n  ${
        el.role === "staff"
          ? "Xodim"
          : el.role == "admin"
          ? "Admin"
          : el.role == "user"
          ? "Foydalanuvchi"
          : "Xato malumot"
      }\n\n`)
  );
  prompt(msg);

  // Read response as text
}

async function login() {
  const body = {};
  let msg = "";
  const command = await prompt(msg);
  await fetch("/auth/login", { method: "post", body: {} });
}

// function addUser(user) {
//   fetch("http://localhost:3000/users/add", {
//     method: "POST",
//     body: {}, // Collect form data
//   })
//     .then((response) => response.text()) // Read response as text
//     .then((data) => alert(data));
// }

// if (typeof(Storage) !== "undefined") {
//   // Code for localStorage/sessionStorage.
//   window.localStorage.hello = 'Salom'
//   // window.localStorage.currentUser = window.localStorage.currentUser || {"Salom"}
//   console.log('Code for localStorage/sessionStorage');
// } else {
//   // Sorry! No Web Storage support..
//   console.log('Sorry! No Web Storage support..');
// }
