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
}

.icon-text{
    display: flex;
    flex-direction: column; 
    margin-left:90px;
    align-items: center;
}
.logout{
    margin-top: 18px;
    margin-right: 10px;
}
i{
    font-size: 30px;
}


@media ( max-width: 1082px) {
    h2{
        font-size: 20px;
    }
    i{
        font-size: 20px;

    }
}

@media ( max-width: 766px) {
    h2{
        font-size: 16px;
        margin-top: 5px;
    }
    p{
        font-size: 15px;
    }
    .logout{
        margin-top: 23px;
        font-size: 22px;
    }
    .icon-text{
        margin-left:45px;
    }
}


@media ( max-width: 594px) {
    h2{
        font-size: 12px;
        margin-top: 5px;
    }

    .icon-text{
        margin-left:45px;
    }
}

@media ( max-width: 456px) {

    i{
        font-size: 18px;
    }
}
@media ( max-width: 430px) {

    .icon-text{
    margin-left:38px;
    }
}
@media ( max-width: 408px) {

    .icon-text{
    margin-left:25px;
    }
    p{
        font-size: 13px;
    }
}


`
export default Component;