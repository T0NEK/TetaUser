export interface Wiersze 
{
   data: string;
   name: string;
   kolor: string;
   tekst: string;
};

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
      stanSQL?: boolean;
      stanAkcji?: boolean;
      stanRejestracja?: boolean;
      stanCzasStartuDedal?: boolean;
      stanCzasDedala?: boolean;
  }