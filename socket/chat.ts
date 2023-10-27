

socket.on('submitMessage', (data) => {
    
  })

  connect.then(database => {
    const chat = new Chat(data);
    chat.save((error, doc) => {
      if (error) {
        console.error(error);
        return io.emit('SocketError', { message: '채팅을 저장하는 과정에서 문제가 발생했습니다.', error })
      }
      Chat.findOne({ '_id': doc._doc._id })
        .populate('writer')
        .exec((error, chat) => {
          if (error) {
            console.error(error);
            return io.emit('SocketError', { message: '채팅을 불러오는 과정에서 문제가 발생했습니다.', error })
          }
          const fullChat = chat.toJSON();
          delete fullChat.writer.password;
          delete fullChat.writer.token;
          return io.emit('returnMessage', { chat: fullChat })
        })
    })
  })