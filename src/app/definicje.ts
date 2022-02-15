export interface Nazwa
  {
    prefix: string;
    text1: string;
    separator: string;
    text2: string;
    sufix: string;
    rodzaj: string;
    kolor: string;  
  }
  
export interface Linia
{
  prefix: string;
  text: Nazwa[];
  sufix: string;
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
      autoryzacja: boolean;
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
      autoryzacja: boolean;
      funkcja: string;
      rodzaj: string;
      kolor: string;
  }

export interface Modul
  {
    id: number;  
    nazwa :string;
    symbol: string;
    producent: string;
    opis: string;
  }

export interface Notatka
  {
    id: number;  
    identyfikator: string;
    tytul :string;
    wlascicielText: string;
    stan: boolean;
    stanText: string;
    czas: string;
  }

export interface Tresc
  {
    id: number;  
    wersja: number;
    czas: string;
    tresc: string;
  }

  export interface StanNotatka
  {
    wczytana : boolean;   //czy wczytana
    edycja: boolean;      //cy w edycji 
    notatka: number;      //id wczytanej notatki  
    wersja: number;       //wersja wczytanej notatki
    zmiany: boolean;      //notatka edytoawna - zmieniona treść
  }