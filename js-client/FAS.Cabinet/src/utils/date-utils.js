export function formatDate(serverDate){
    const f = formatNumber2Digits;
    const ct = new Date(serverDate);
    ct.setHours(ct.getHours() - (new Date().getTimezoneOffset())/60);
    return `${f(ct.getDate())}.${f(ct.getMonth()+1)}.${ct.getFullYear()} ${f(ct.getHours())}:${f(ct.getMinutes())}:${f(ct.getSeconds())}`;
  };
function formatNumber2Digits(number){
    return ("0" + number).slice(-2);
  }