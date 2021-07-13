import React from 'react';
import '../index.css';
import api from '../utils/api';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import {Redirect, Route, Switch} from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Register from "./Register";

import {CurrentUserContext} from "../contexts/CurrentUserContext";

function App() {
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([])
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    //Авторизация
    const [loggedIn, setLoggedIn] = React.useState(false);


    //запрос данных пользователя
    React.useEffect(() => {
        api.getUserInfo()
            .then((data) => {
                setCurrentUser(data)
            })
            .catch((err) => console.log(err))

    }, [])

    //запрос карточек
    React.useEffect(() => {
        api.getInitialCards()
            .then((data) => {
                setCards(data)
            })
            .catch((err) => console.log(err))

    }, [])


    function handleCardClick(card) {
        setSelectedCard(card)
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function closeAllPopups() {
        setSelectedCard(null)
        setIsEditProfilePopupOpen(false)
        setIsAddPlacePopupOpen(false)
        setIsEditAvatarPopupOpen(false)
    }

    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
            .catch((err) => {
                console.log(err)
            })
    }

    //функция запроса удаления карточек
    function handleCardDelete(card) {
        api.cardDelete(card._id)
            .then(() => {
                setCards((state) => state.filter((c) => c !== card))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateUser(data) {
        api.editUserData(data)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleUpdateAvatar(data) {
        api.updateAvatar(data)
            .then((data) => {
                setCurrentUser(data);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleAddPlaceSubmit(data) {
        api.addCard(data)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups()
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header/>
                <Switch>
                    <Route path='/sign-in'>
                        <Login/>
                    </Route>
                    <Route path='/sign-up'>
                        <Register/>
                    </Route>
                    <Route>
                        {loggedIn ? <Redirect to ="/sign-in" /> : <Redirect to ="/" />}
                    </Route>
                <ProtectedRoute exact path='/'
                                component={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                />
                </Switch>
                <Footer/>
                <ImagePopup card={selectedCard !== null && selectedCard} onClose={closeAllPopups}/>
                <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}
                                  onUpdateUser={handleUpdateUser}/>
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                                 onUpdateAvatar={handleUpdateAvatar}/>
                <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
            </div>
        </CurrentUserContext.Provider>
    )
}

export default App;
