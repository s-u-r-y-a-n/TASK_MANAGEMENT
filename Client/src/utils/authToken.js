export const isAccessTokenValid = (accessToken) => {
  if (!accessToken) return false;

  try {
    const [, payload] = accessToken.split(".");
    if (!payload) return false;

    const decodedPayload = JSON.parse(
      decodeURIComponent(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
          .split("")
          .map(
            (character) =>
              `%${`00${character.charCodeAt(0).toString(16)}`.slice(-2)}`,
          )
          .join(""),
      ),
    );
    return (
      typeof decodedPayload.exp === "number" &&
      decodedPayload.exp * 1000 > Date.now()
    );
  } catch {
    return false;
  }
};
