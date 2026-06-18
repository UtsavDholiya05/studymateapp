class SocketSimulator {
  constructor() {
    this.listeners = {};
    this.connected = false;
    this.backgroundTimer = null;
  }

  connect() {
    this.connected = true;
    this.trigger("connect");
    console.log("[SocketSimulator] Connected to real-time events");
    this.startBackgroundSimulator();
  }

  disconnect() {
    this.connected = false;
    this.trigger("disconnect");
    console.log("[SocketSimulator] Disconnected");
    this.stopBackgroundSimulator();
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }

  emit(event, data) {
    if (event === "group_message") {
      // Trigger local receipt (echo message back to user)
      this.trigger("group_message", data);

      // Simulate reply from other members in 2-4 seconds
      this.simulateReply(data);
    }
  }

  trigger(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((cb) => cb(data));
    }
  }

  simulateReply(messageData) {
    const { groupId, groupName, message } = messageData;

    const botMembers = [
      { name: "Sarah", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
      { name: "John", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
      { name: "Emma", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
    ];

    const responses = [
      "Awesome! Let's work on this together.",
      "I was just looking into that topic. Let's study it!",
      "Good point! I will join the study session in 5 minutes.",
      "Wait, could you clarify that part?",
      "Thanks for sharing!",
      "Perfect, I am opening my notes now.",
      "Shall we start a video call or just chat here?",
      "Let's focus on finishing Chapter 5 today!",
    ];

    // Select a random bot member who isn't the user
    const responder = botMembers[Math.floor(Math.random() * botMembers.length)];
    const textReply = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
      if (!this.connected) return;

      const responseMessage = {
        id: `reply_${Date.now()}`,
        text: textReply,
        senderName: responder.name,
        senderId: responder.name.toLowerCase(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: responder.avatar,
      };

      this.trigger("group_message", {
        groupId,
        groupName,
        message: responseMessage,
      });
    }, 2000 + Math.random() * 2000);
  }

  startBackgroundSimulator() {
    if (this.backgroundTimer) return;

    const runSim = () => {
      // Trigger a message every 30-45 seconds
      const nextDelay = 30000 + Math.random() * 15000;
      this.backgroundTimer = setTimeout(() => {
        if (!this.connected) {
          runSim();
          return;
        }

        const groups = [
          { id: "1", name: "AI Study Group" },
          { id: "2", name: "Web Dev Team" },
        ];
        const randomGroup = groups[Math.floor(Math.random() * groups.length)];

        const botMembers = [
          { name: "Sarah", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
          { name: "John", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
          { name: "Emma", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
        ];
        const responder = botMembers[Math.floor(Math.random() * botMembers.length)];

        const generalMessages = [
          "Hey, did anyone solve the third homework problem?",
          "Don't forget we have our session at 5pm today!",
          "I just uploaded some new study notes.",
          "Good morning! Let's get stuff done today.",
          "Who is up for a quick meeting?",
          "I am stuck on Chapter 3. Can someone help?",
        ];
        const randomText = generalMessages[Math.floor(Math.random() * generalMessages.length)];

        const responseMessage = {
          id: `bg_${Date.now()}`,
          text: randomText,
          senderName: responder.name,
          senderId: responder.name.toLowerCase(),
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: responder.avatar,
        };

        this.trigger("group_message", {
          groupId: randomGroup.id,
          groupName: randomGroup.name,
          message: responseMessage,
        });

        runSim();
      }, nextDelay);
    };

    runSim();
  }

  stopBackgroundSimulator() {
    if (this.backgroundTimer) {
      clearTimeout(this.backgroundTimer);
      this.backgroundTimer = null;
    }
  }
}

const socket = new SocketSimulator();
export default socket;
