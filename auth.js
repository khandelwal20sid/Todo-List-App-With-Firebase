
auth.onAuthStateChanged(user=>{
   
    getTodos();
    setupUI(user)
})

const logout = document.querySelector('#logout');
logout.addEventListener('click', e=>{
    e.preventDefault();
    auth.signOut();
})


const loginForm =  document.querySelector('#login-form');
loginForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    firebase.auth().signInWithEmailAndPassword(email,password).then(()=>{
        const modal = document.querySelector('#Modal-login');
        $('#Modal-login').modal('hide');
        loginForm.querySelector('.error').innerHTML = ''
        loginForm.reset();        

    }).catch (err => {
        loginForm.querySelector('.error').innerHTML = err.message
    })    
    
})


const signupForm =  document.querySelector('#signup-form');
signupForm.addEventListener('submit', e=>{
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    auth.createUserWithEmailAndPassword(email,password).then(()=>{
        const modal = document.querySelector('#Modal-signup');
        $('#Modal-signup').modal('hide');
        signupForm.querySelector('.error').innerHTML = ''
        signupForm.reset();

    }).catch (err => {
        signupForm.querySelector('.error').innerHTML = err.message
    })
    
})