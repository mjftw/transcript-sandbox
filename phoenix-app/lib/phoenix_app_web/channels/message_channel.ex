defmodule PhoenixAppWeb.MessageChannel do
  use Phoenix.Channel

  @impl true
  def join("chat:" <> _room_id, payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("send_message", %{"message" => message, "user" => user}, socket) do
    broadcast(socket, "new_message", %{message: message, user: user})
    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
