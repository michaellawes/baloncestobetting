import { Parlay, SupabaseParlay } from "./Parlay";
import * as React from "react";
//import { useEffect } from "react";
//import supabase from "../../config/supabaseConfig";
import { UserData } from "../../App";
import { demoParlays } from "../../utils/Util";

export interface ParlaysViewerProps {
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  user: UserData;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
export function Parlays(props: ParlaysViewerProps) {
  const { setBalance /*user, setErrorMessage*/ } = props;
  const [parlays /*setParlays*/] =
    React.useState<SupabaseParlay[]>(demoParlays);

  /*const validateFinishedSlips = (data: SupabaseParlay[]) => {
    for (const parlay of data) {
      parlay.is_active = new Date(parlay.expires_at).getTime() > Date.now();
    }
    return data;
  };

  const validateResultOfFinishedSlips = (data: SupabaseParlay[]) => {
    const finishedSlips = data.filter(
      (parlay) => !parlay.is_active && !parlay.is_payed_out,
    );
    return finishedSlips;
  };*/

  /*useEffect(() => {
    const getParlays = async () => {
      const { data, error } = await supabase
        .from("parlays")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setErrorMessage(error.message);
      }

      if (data) {
        setErrorMessage("");
        const validatedSlips = validateFinishedSlips(data);
        setParlays(validatedSlips);
      }
    };
    getParlays();
  }, []);*/

  return (
    <div className="flex flex-col w-full h-full bg-gray-600">
      <ul className="bg-gray-600">
        {parlays.map((parlay, i) => (
          <li key={i}>
            <Parlay {...parlay} setBalance={setBalance} />
          </li>
        ))}
      </ul>
    </div>
  );
}
