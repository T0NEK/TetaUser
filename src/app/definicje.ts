export interface Nazwa
  {
    prefix: string;
    text: string;
    sufix: string;
    rodzaj: string;
    kolor: string;  
    dlugosc: number;
  }
  
export interface Linia
{
  prefix: string;
  text: Nazwa[];
  sufix: string;
  dlugosc: number;
}
  
export interface Wiersze 
   {
      data: string;
      name: string;
      prefix: string;
      linia: Linia[];
      sufix: string;
   }

export interface Osoby
   {
      id: number;
      imie: string;
      nazwisko: string;
      funkcja: string;
      zalogowany: boolean;
      polecenia: boolean;
      blokada: boolean;
      osoby: boolean;
  }

export interface Sprawdz
  {
      stanSQL: boolean;
      stanAkcji: boolean;
      stanRejestracja: boolean;
      stanCzasStartuDedal: boolean;
      stanCzasDedala: boolean;
      stanPolecenia: boolean;
      stanDzialania: boolean;
  }

export interface Polecenia
  {
      nazwa: string;
      czas: number;
      dzialanie: string;
      polecenie: boolean;
      prefix: string;
      komunikat: string;
      sufix: string;
      nastepnyTrue: string;
      nastepnyFalse: string;
  }

export interface Zalogowany
  {
      zalogowany: number;
      imie: string;
      nazwisko: string;
      funkcja: string;
      rodzaj: string;
      narosl: boolean;
      polecenia: boolean;
      kolor: string;
  }

export interface Modul
  {
    id: number;  
    nazwa :string;
    symbol: string;
    stan: string;
    czasbadania: string
    opis: string;
  }

export interface Zespol
  {
    id: number;  
    nazwa :string;
    symbol: string;
    idmodul: string;
    stan: number;
    czaswykonania: number;
    elementy: number;
    stanwynik: string;
    naprawaporeset: number;
    imie: string; 
    nazwisko: string;
    czasbadania: string;
    czaszakonczenia: string;
    opis: string;
    modulSymbol: string;
    modulNazwa: string;
  }


export interface Notatka
  {
    id: number;  
    identyfikator: string;
    tytul :string;
    wlasciciel: number;
    wlascicielText: string;
    stan: boolean;
    stanText: string;
    czas: string;
  }

export interface Tresc
  {
    id: number;  
    wersja: number;
    stan: boolean;
    stanText: string;
    czas: string;
    tresc: string;
  }

  export interface StanNotatka
  {
    wczytana : boolean;   //czy wczytana
    edycja: boolean;      //czy w edycji 
    notatka: Notatka;      //wczytana notatka  
    wersja: number;       //wersja wczytanej notatki
    zmiany: boolean;      //notatka edytoawna - zmieniona treść
    tresc: string;        //zmieniona treść 
  }

  export interface Kolory
  {
    info: string;
    alert: string;
    krytyczny: string;
    liniakomend: string;
    zalogowany: string;
    wylogowany: string;  
  }

  export interface OsobyWiadomosci
   {
      id: number;
      imie: string;
      nazwisko: string;
      funkcja: string;
      widoczny: boolean;
      wybrany: boolean;
      nowe: boolean;
  }

  export interface Wiadomosci
  {
     id: number;
     autor: number;
     autorText: string;
     odbiorca: number;
     odbiorcaText: string;
     tresc: string[];
     czas: string;
     przeczytana: boolean;
     wyslana: boolean;
 }