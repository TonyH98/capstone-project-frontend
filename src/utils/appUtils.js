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

export const getMessageListByUserId = (user_id) => {
  let res = [];
  let localStorageKey = `messageList_${user_id}`;
  let tempInfo = localStorage.getItem(localStorageKey);
  if (tempInfo){
    res = JSON.parse(tempInfo);
  }

  return res;

}

export const saveMessageByUserId = (user_id, messageContent) => {
  let localStorageKey = `messageList_${user_id}`;
  let messageList = getMessageListByUserId(user_id);
  messageList.push(messageContent);

  localStorage.setItem(localStorageKey, JSON.stringify(messageList));
  return messageList;
}