use anchor_lang::prelude::*;

declare_id!("oerHQbgnZu3h3inupfhAYgL6V9KbW1XSdKsvD1Ch8ox");

#[program]
pub mod inc {
    use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data = 0;
        msg!("account initialized with 0 ");
        Ok(())
    }
        pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data += 1;
        msg!("increament data: {}", my_account.data);
        Ok(())
    }
     pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.data -= 1;
        msg!("Decrement data: {}", my_account.data);
        Ok(())
    }

}



#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub my_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,
}

#[account]
pub struct MyAccount {
    pub data: u64,
}
