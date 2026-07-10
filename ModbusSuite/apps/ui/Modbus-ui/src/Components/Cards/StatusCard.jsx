import "./StatusCard.css";

function StatusCard({

    title,

    value,

    unit,

    color

}){

    return(

        <div className="card">

            <p className="title">

                {title}

            </p>

            <h2 style={{color}}>

                {value}

                <span>{unit}</span>

            </h2>

        </div>

    );

}

export default StatusCard;