// Generado desde el proyecto Supabase "zama bacalar" (wsxvfblesczijlbqbrbu).
// Si cambia el esquema, regenerar con `supabase gen types typescript`.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type LeadTipo = "cotizacion" | "contacto" | "broker";

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" };
  public: {
    Tables: {
      admins: {
        Row: { created_at: string; nombre: string | null; usuario_id: string };
        Insert: { created_at?: string; nombre?: string | null; usuario_id: string };
        Update: { created_at?: string; nombre?: string | null; usuario_id?: string };
        Relationships: [];
      };
      leads: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          interes: string | null;
          locale: string | null;
          mensaje: string | null;
          nombre: string;
          referrer: string | null;
          telefono: string;
          tipo: LeadTipo;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          interes?: string | null;
          locale?: string | null;
          mensaje?: string | null;
          nombre: string;
          referrer?: string | null;
          telefono: string;
          tipo?: LeadTipo;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { is_admin: { Args: never; Returns: boolean } };
    Enums: { lead_tipo: LeadTipo };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
