import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppProvider } from "@/lib/app-store";
import { CategorySheet } from "@/routes/settings";
const STORAGE_KEY = "tmab-state-v1";
beforeEach(() => {
  window.localStorage.clear();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({user:{id:"u1",name:"T",provider:"telegram"},transactions:[],wallets:[],walletActivity:[],categories:[{id:"c1",name:"Bonus",type:"income"},{id:"c2",name:"Gaji",type:"income"},{id:"c3",name:"Internet",type:"expense"},{id:"c4",name:"Kopi",type:"expense"},{id:"c5",name:"Makan",type:"expense"}],language:"id"}));
});
it("dump", async () => {
  const user = userEvent.setup();
  render(<AppProvider><CategorySheet onClose={() => {}} /></AppProvider>);
  await waitFor(() => expect(document.querySelectorAll('[data-testid^="category-item-"]').length).toBe(5));
  screen.getByTestId("category-search").focus();
  const seq: (string|null)[] = [];
  for (let i=0;i<10;i++){ await user.tab(); seq.push((document.activeElement as HTMLElement)?.dataset["testid"] ?? (document.activeElement as HTMLElement)?.tagName ?? null); }
  console.log("SEQ", seq);
});
