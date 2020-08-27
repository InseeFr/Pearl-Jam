import React, { useState, useEffect } from 'react';
import D from 'i18n';

const ChatPage = () => {
  const [urlChat, setUrlChat] = useState(null);

  useEffect(() => {
    if (!urlChat) {
      const init = async () => {
        const response = await fetch(`${window.location.origin}/configuration.json`);
        const configuration = await response.json();
        setUrlChat(configuration.CHAT_URL);
      };
      init();
    }
  }, [urlChat]);

  return (
    <div className="panel-body chat">
      {urlChat && <iframe id="chat" width="100%" height="100%" title="Chat Pearl" src={urlChat} />}
      {!urlChat && <h2>{D.specifyChatUrl}</h2>}
    </div>
  );
};

export default ChatPage;
