export const APP_SLUG = "lazari-ways";
export const APP_NAME = "Lazari Ways";
export const ADMIN_SESSION_COOKIE = APP_SLUG + "." + "admin_session_token";
export const SESSION_COOKIE = APP_SLUG + "." + "session_token";

export const WHATSAPP_NUMBER = "+4917632983291";
export const WHATSAPP_TEXT =
  "გამარჯობა, თქვენი კონტაქტი ვიპოვე თქვენს ვებსაიტზე და მინდა დაგიკავშირდეთ.";

export const WHATSAPP_URL = `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_TEXT}&type=phone_number&app_absent=0`;
