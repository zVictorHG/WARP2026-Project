/**************************************************************************\
*                                                                          *
*   Copyright (C) 2021-2024 Neo-Mind                                       *
*                                                                          *
*   This file is a part of WARP project                                    *
*                                                                          *
*   WARP is free software: you can redistribute it and/or modify           *
*   it under the terms of the GNU General Public License as published by   *
*   the Free Software Foundation, either version 3 of the License, or      *
*   (at your option) any later version.                                    *
*                                                                          *
*   This program is distributed in the hope that it will be useful,        *
*   but WITHOUT ANY WARRANTY; without even the implied warranty of         *
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the          *
*   GNU General Public License for more details.                           *
*                                                                          *
*   You should have received a copy of the GNU General Public License      *
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.  *
*                                                                          *
*                                                                          *
|**************************************************************************|
*                                                                          *
*   Author(s)     : Neo-Mind, Victor Hugo                                  *
*   Created Date  : 2021-08-20                                             *
*   Last Modified : 2026-06-10                                             *
*                                                                          *
\**************************************************************************/

//
// Stores the language type
// ========================
//
// MODULE_NAME => LANGTYPE
// -----------------------

///
/// \brief Local data members
///
const self = 'LANGTYPE';

/**Will be true or false indicating extraction status**/
var Valid;

/**Will contain the Error Object with a message about the issue encountered during extraction if any**/
var ErrMsg;

/**The g_serviceType VIRTUAL Address**/
var Value;

/**It's hex in Little Endian form**/
var Hex;

///
/// \brief Initialization Function
///
export function init()
{
	Value   = -1;
	Hex     = '';
	Valid  = null;
	ErrMsg = null;

	Identify(self, ['init', 'load', 'toString', 'valueOf']);
}

///
/// \brief Function to extract data from loaded exe and set the members
///
export function load()
{
	const _ = Log.dive(self, 'load');

	$$(_, 1.1, `Check if load was already called`)
	if (Valid != null)
	{
		$$(_, 1.2, `Check for errors and report them again if present otherwise simply return`)
		Log.rise();

		if (Valid)
			return Valid;
		else
			throw ErrMsg;
	}

	$$(_, 1.3, `Initialize [Valid] to false`)
	Valid = false;

	function ResolveNewerLangSlot()
	{
		const anchors =
		[
			{ code : `B8 77 02 00 00 66 89 85 ?? ?? ?? ?? A1 ?? ?? ?? ??`, immOff : 13 },
			{ code : `B8 77 02 00 00 66 89 45 ?? A1 ?? ?? ?? ??`,             immOff : 10 },
			{ code : `B8 64 00 00 00 66 89 85 ?? ?? ?? ?? A1 ?? ?? ?? ??`, immOff : 13 },
			{ code : `B8 64 00 00 00 66 89 45 ?? A1 ?? ?? ?? ??`,             immOff : 10 },
			{ code : `B8 0E 0C 00 00 66 89 85 ?? ?? ?? ?? A1 ?? ?? ?? ??`, immOff : 13 },
			{ code : `B8 0E 0C 00 00 66 89 45 ?? A1 ?? ?? ?? ??`,             immOff : 10 },
		];

		const candidates = [];
		for (const anchor of anchors)
		{
			const at = Exe.FindHex(anchor.code);
			if (at >= 0)
				candidates.push(Exe.GetUint32(at + anchor.immOff));
		}

		if (candidates.isEmpty())
			return -1;

		let bestAddr = -1;
		let bestCount = -1;
		for (const candidate of candidates)
		{
			const packed = candidate.toHex(4);
			let readCount = Exe.FindHexN("A1 " + packed).length;
			for (const r of [0, 1, 2, 3, 5, 6, 7])
			{
				const modrm = ((r << 3) | 0x05).toString(16).padStart(2, "0").toUpperCase();
				readCount += Exe.FindHexN("8B " + modrm + " " + packed).length;
			}
			if (readCount > bestCount)
			{
				bestAddr = candidate;
				bestCount = readCount;
			}
		}

		return bestAddr;
	}

	$$(_, 1.4, `Find the string 'america'`)
	let strAddr = Exe.FindText("america");
	let addr;
	if (strAddr > 0)
	{
		$$(_, 1.5, `Find where it is PUSHed`)
		addr = Exe.FindHex( PUSH(strAddr) );
		if (addr > 0)
		{
			$$(_, '1.5.1', `Move addr to location after PUSH`)
			addr += 5;
		}
		else if (ROC.FullVer == 14.29)
		{
			$$(_, 1.6, `For latest VC14 clients the string is moved to a register and then to local stack. So look for that`)
			let code =
				MOV(R32, [strAddr])              //mov regD, dword ptr [strAddr]
			+	MOV(BYTE_PTR, [EBP, NEG2WC], 0)  //mov byte ptr [LOCAL.x], 0
			;
			addr = Exe.FindHex(code);
			if (addr > 0)
			{
				$$(_, '1.6.1', `Find the pattern that is close to the langtype address assignment after the MOV`)
				code =
					PUSH(7) //push 7
				+	PUSH_R  //push regA
				+	PUSH_R  //push regB
				+	PUSH_R  //push regC
				+	CALL()  //call func#1
				;
				addr = Exe.FindHex(code, addr + 0x40, addr + 0x100);
			}
		}
		if (addr < 0)
			throw Log.rise(ErrMsg = new Error(`${self} - 'america' not used`));
	}
	else if (ROC.FullVer == 14.29)
	{
		$$(_, 2.1, `Find the string 'america' compared in parts`)
		const code =
			CMP([R32], 0x72656D61)          //cmp dword ptr [r32], 616D6572h ; 'amer'
		+	JNE(WCp)                        //jne short _skip
		+	CMP(WORD_PTR, [R32, 4], 0x6369) //cmp word ptr [r32+4], 6963h    ; 'ic'
		+	JNE(WCp)                        //jne short _skip
		+	CMP(BYTE_PTR, [R32, 6], 0x61)   //cmp byte ptr [r32+6], 61h      ; 'a'
		;

		addr = Exe.FindHex(code);
		if (addr < 0)
		{
			$$(_, '2.1.1', `Find newer service type slot without the 'america' string`)
			Value = ResolveNewerLangSlot();
			if (Value < 0)
				throw Log.rise(ErrMsg = new Error(`${self} - 'america' not found in parts`));

			Hex = Value.toHex(4);
			return Log.rise(Valid = true);
		}

		$$(_, 2.2, `Move addr to location after the code`)
		addr += code.byteCount();
	}
	else
	{
		$$(_, 2.3, `Find newer service type slot without the 'america' string`)
		Value = ResolveNewerLangSlot();
		if (Value < 0)
			throw Log.rise(ErrMsg = new Error(`${self} - 'america' not found`));

		Hex = Value.toHex(4);
		return Log.rise(Valid = true);
	}

	$$(_, 3.1, `Find an assignment to g_serviceType after it`)
	addr = Exe.FindHex( MOV([POS4WC], 1), addr); //mov dword ptr ds:[g_serviceType], 1
	if (addr < 0)
		throw Log.rise(ErrMsg = new Error(`${self} - g_serviceType not assigned`));

	$$(_, 3.2, `Extract the address to [Value] & save it's hex`)
	Value = Exe.GetUint32(addr + 2);
	Hex = Value.toHex(4);

	$$(_, 3.3, `Set [Valid] to true`)
	return Log.rise(Valid = true);
}

///
/// \brief Override to return the hex value
///
export function toString()
{
	return Hex;
}

///
/// \brief Override to return the numeric value
///
export function valueOf()
{
	return Value;
}


///
/// \brief Tester
///
export function debug()
{
	if (Valid == null)
		load();

	if (Valid == null)
	{
		Info(self + ".ErrMsg = ", ErrMsg);
		return false;
	}
	else
	{
		ShowAddr(self, Value, VIRTUAL);
		return true;
	}
}
