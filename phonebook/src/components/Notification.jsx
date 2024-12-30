const Notification = ({type, text})=>{
    if(!text){
        return null
    }
    const notificationClass = type==='error'? 'notification error' : 'notification message'
    return(
        <div className={notificationClass}>
            {text}
        </div>
    )
}

export default Notification