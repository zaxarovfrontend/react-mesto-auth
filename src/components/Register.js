import React from "react";
import {Link}  from 'react-router-dom';

function Register() {


    return(
        <div className='login'>
            <h1 className='login__title' >Регистрация</h1>
            <form className='login__form'>
                <input className='login__input' placeholder='Email'/>
                <input className='login__input' placeholder='Пароль'/>
                <button className='login__button'>Зарегистрироваться</button>
                <Link className='login__question'>Уже зарегистрированы?Войти</Link>
            </form>
        </div>
    );

}

export default Register;
