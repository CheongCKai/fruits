import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChatBox from '../Components/ChatBox';
import { HistoryContainer } from './CustomerStyle';


const ContactUs = ({userUid}) => {
   

    return (
        <HistoryContainer>
          <ChatBox userUid={userUid}/>
            
        </HistoryContainer>

    )
};

export default ContactUs;