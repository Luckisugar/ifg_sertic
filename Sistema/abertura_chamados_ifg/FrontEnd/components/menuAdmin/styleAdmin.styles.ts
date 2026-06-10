import styled from "styled-components";

const Component = styled.div`
width: 100%;
height: 70px;
background-color: #1C5E27;
display: flex;
color: #FFF;

.user{
    display: flex;
    flex-direction: column;
    margin-left: auto; 
    text-align: right; 
    margin-right: 18px;
    margin-top: 15px;
}
.options{
    display: flex;
    align-items: center; 
    justify-content: center;
}

.icon-text{
    display: flex;
    flex-direction: column; 
    margin-left:90px;
    align-items: center;
}
.logout{
    margin-top: 2px;
    margin-right: 22px;
    background-color: transparent;
    border: none;
    color: #FFF;
    cursor: pointer;
}
i{
    font-size: 30px;
}



@media ( max-width: 1787px) {
    h2{
        font-size: 20px;
    }
    i{
        font-size: 25px;
    }
    p{
        font-size: 15px;
    }
    .icon-text{
        margin-left:45px;
    }
}


@media ( max-width: 1227px) {
    h2{
        font-size: 18px;
    }
    i{
        font-size: 18px;

    }
    .user{
        margin-top: 18px;
    }
    .logout{
        margin-top: 23px;
        font-size: 22px;
    }
}
@media ( max-width: 1249px) {
    h2{
        font-size: 15px;
    }
    .logout{
        margin-top: 23px;
        font-size: 22px;
    }
    p{
        font-size: 13px;
    }
}
@media ( max-width: 1147px) {
    h2{
        font-size: 15px;
    }
    .icon-text{
        margin-left:40px;
    }
}


@media ( max-width: 1119px) {
    h2{
        font-size: 15px;
    }
    i{
        font-size: 18px;

    }
    .icon-text{
        margin-left:30px;
    }
    p{
        font-size: 14px;
    }
}
@media ( max-width: 1055px) {
    p{
        font-size: 13px;
    }
}

@media ( max-width: 971px) {
    i{
        font-size: 18px;

    }
    .icon-text{
        margin-left:25px;
    }
   

}

@media ( max-width: 933px) {
    p{
        font-size: 12px;
    }
    i{
        font-size: 15px;

    }
    .icon-text{
        margin-left:20px;
    }

}

@media ( max-width: 831px) {
    .icon-text{
        text-align: center;
    }

}

@media ( max-width: 803px) {
    h2{
        font-size: 15px;
    }
    .icon-text{
        margin-left:12px;
        text-align: center;
    }

}

@media ( max-width: 589px) {

    .user p,h2{
        display: none;
    }
}
@media ( max-width: 415px) {

    .icon-text{
    margin-left:10px;
    }
    p{
        font-size: 11px;
    }
}

@media ( max-width: 390px) {

    .icon-text{
    margin-left:7px;
    }
    p{
        font-size: 10px;
    }
}


`
export default Component;