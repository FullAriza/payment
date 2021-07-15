import { Environment } from "../env/Environment";
import { AuthResponse } from "../models/ApiDto";
import { Asset, AssetType } from "../models/Asset";
import { BuyRoute, BuyRouteDto, fromBuyRouteDto, toBuyRouteDto } from "../models/BuyRoute";
import { Country } from "../models/Country";
import { Fiat } from "../models/Fiat";
import { fromActivePaymentRoutesDto, fromPaymentRoutesDto, PaymentRoutes, PaymentRoutesDto } from "../models/PaymentRoutes";
import { fromSellRouteDto, SellRoute, SellRouteDto, toSellRouteDto } from "../models/SellRoute";
import { fromUserDto, NewUser, toNewUserDto, toUserDto, User, UserDto } from "../models/User";
import AuthService, { Credentials, Session } from "./AuthService";

const BaseUrl = Environment.api.baseUrl;
const AuthUrl = "auth";
const UserUrl = "user";
const BuyUrl = "fiat2crypto";
const SellUrl = "crypto2fiat";
const RouteUrl = "registration";
const AssetUrl = "asset";
const FiatUrl = "fiat";
const CountryUrl = "country";


// --- AUTH --- //
export const signIn = (credentials?: Credentials): Promise<string> => {
  return fetchFrom<AuthResponse>(`${BaseUrl}/${AuthUrl}/signIn`, buildInit("POST", undefined, credentials))
    .then((resp) => resp.accessToken);
};

export const signUp = (user: NewUser): Promise<string> => {
  return fetchFrom<AuthResponse>(`${BaseUrl}/${AuthUrl}/signUp`, buildInit("POST", undefined, toNewUserDto(user)))
    .then((resp) => resp.accessToken);
}

// --- USER --- //
export const getUser = (): Promise<User> => {
  return AuthService.Session.then((s) => fetchFrom<UserDto>(`${BaseUrl}/${UserUrl}`, buildInit("GET", s)))
    .then((dto: UserDto) => fromUserDto(dto));
};

export const putUser = (user: User): Promise<User> => {
  return AuthService.Session.then((session) => fetchFrom<UserDto>(`${BaseUrl}/${UserUrl}/${session.address}`, buildInit("PUT", session, toUserDto(user))))
    .then((dto: UserDto) => fromUserDto(dto));
};

// --- PAYMENT ROUTES --- //
export const getRoutes = (): Promise<PaymentRoutes> => {
  return getRoutesDto()
    .then((routes) => fromPaymentRoutesDto(routes));
};

export const getActiveRoutes = (): Promise<PaymentRoutes> => {
  return getRoutesDto()
    .then((routes) => fromActivePaymentRoutesDto(routes));
};

const getRoutesDto = (): Promise<PaymentRoutesDto> => {
  return AuthService.Session.then((session) =>
    fetchFrom<PaymentRoutesDto>(`${BaseUrl}/${RouteUrl}`, buildInit("GET", session))
  );
};

export const postBuyRoute = (route: BuyRoute): Promise<BuyRoute> => {
  return AuthService.Session
    .then((session) => fetchFrom<BuyRouteDto>(`${BaseUrl}/${BuyUrl}`, buildInit("POST", session, toBuyRouteDto(route))))
    .then((dto) => fromBuyRouteDto(dto));
};

export const putBuyRoute = (route: BuyRoute): Promise<BuyRoute> => {
  return AuthService.Session
    .then((session) => fetchFrom<BuyRouteDto>(`${BaseUrl}/${BuyUrl}/${route.id}`, buildInit("PUT", session, toBuyRouteDto(route))))
    .then((dto) => fromBuyRouteDto(dto));
};

export const postSellRoute = (route: SellRoute): Promise<SellRoute> => {
  return AuthService.Session
    .then((session) => fetchFrom<SellRouteDto>(`${BaseUrl}/${SellUrl}`, buildInit("POST", session, toSellRouteDto(route))) )
    .then((dto) => fromSellRouteDto(dto));
};

export const putSellRoute = (route: SellRoute): Promise<SellRoute> => {
  return AuthService.Session
    .then((session) => fetchFrom<SellRouteDto>(`${BaseUrl}/${SellUrl}/${route.id}`, buildInit("PUT", session, toSellRouteDto(route))))
    .then((dto) => fromSellRouteDto(dto));
};

// --- MASTER DATA --- //
export const getAssets = (): Promise<Asset[]> => {
  return fetchFrom<Asset[]>(`${BaseUrl}/${AssetUrl}`);
};

export const getFiats = (): Promise<Fiat[]> => {
  return fetchFrom<Fiat[]>(`${BaseUrl}/${FiatUrl}`);
};

export const getCountries = (): Promise<Country[]> => {
  return fetchFrom<Country[]>(`${BaseUrl}/${CountryUrl}`);
};

// --- HELPERS --- //
const buildInit = (method: "GET" | "PUT" | "POST", session?: Session, data?: any): RequestInit => ({
  method: method,
  headers: {
    "Content-Type": "application/json",
    Authorization: session ? "Bearer " + session.accessToken : "",
  },
  body: JSON.stringify(data),
});

const fetchFrom = <T>(url: string, init?: RequestInit): Promise<T> => {
  return fetch(url, init).then((response) => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then((body) => {
      throw body;
    });
  });
};
};
