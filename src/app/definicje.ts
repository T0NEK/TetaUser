export interface Wiersze 
   {
      data: string;
      name: string;
      kolor: string;
      tekst: string;
      klasa: string;
   }

export interface Osoby
   {
      id: number;
      imie: string;
      nazwisko: string;
      funkcja: string;
      zalogowany: boolean;
      blokada: boolean;
      hannah: boolean;
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
      komunikat: string;
      nastepny: string;
  }

  export interface Zalogowany
  {
      zalogowany: number;
      imie: string;
      nazwisko: string;
      funkcja: string;
      rodzaj: string;
      kolor: string;
  }
