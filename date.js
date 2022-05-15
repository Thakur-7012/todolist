module.exports.getDate=()=>{
    var today=new Date();
    let options={
        weekday:'long',
        year:"numeric",
        month:'long'
    };
    var day=today.toLocaleDateString("en-US",options);
    return day;
}

module.exports.getDay=()=>{
    var today=new Date();
    let options={
        weekday:'long',
    };
    var day=today.toLocaleDateString("en-US",options);
    return day;
}