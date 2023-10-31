import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :phoenix_app, PhoenixAppWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "vY5usZY45moO3c32cnP605IjfvKPIWHYO2u0DAoLREtkdqP1SZYQ7IAk3FTVCy3L",
  server: false

config :phoenix_app,
  websocket_secret: System.get_env("WEBSOCKET_SECRET", "supersecret")

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
