defmodule TranscriptAppWeb.TranscriptChannel do
  use Phoenix.Channel

  @impl true
  def join("transcript:" <> _room_id, _message, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end

  def handle_in("send_transcript", %{"body" => body, "user_id" => user_id}, socket) do
    broadcast(socket, "new_transcript", %{body: body, user_id: user_id})
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
