package com.cromoteca.services;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.vaadin.hilla.signals.ListSignal;

@BrowserCallable
@AnonymousAllowed
public class ChatService {
    private record Message(String userName, String text, int userColorIndex) {}
    private ListSignal<Message> messages = new ListSignal<>(Message.class);

    public ListSignal<Message> getMessages() {
        return messages;
    }
}
