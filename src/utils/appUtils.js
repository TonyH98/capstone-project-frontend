export const getUserInfo = () => {
    let userInfo = null;
    let tempUserInfo = localStorage.getItem('user_info');
    if (!tempUserInfo) {
      userInfo = JSON.parse(tempUserInfo);
    }

    return userInfo;
}

export const setUserInfo = (userInfo) => {
    localStorage.setItem('user_info', JSON.stringify(userInfo));
}